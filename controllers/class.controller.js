
const { Op } = require('sequelize');
const Class = require('../models/Class');
const ClassSession = require('../models/ClassSession');
const ClassStudent = require('../models/ClassStudent');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { RRule } = require('rrule');



async function createSessionsForClass(cls, datetime, duration, recurrenceRule) {
  const sessions = [];

  if (!recurrenceRule) {
    // one-off session
    const start = new Date(datetime);
    const end = new Date(start.getTime() + duration * 60000);

    const s = await ClassSession.create({
      class_id: cls.id,
      start_time: start,
      end_time: end,
    });
    sessions.push(s);
  } else {
    // TODO: expand recurrence rule with rrule lib
    // Example: generate next 5 occurrences weekly
    const { RRule } = require('rrule');

    const rule = RRule.fromString(recurrenceRule);
    const dates = rule.all().slice(0, 10); // limit expansion

    for (const d of dates) {
      const start = d;
      const end = new Date(start.getTime() + duration * 60000);
      const s = await ClassSession.create({
        class_id: cls.id,
        start_time: start,
        end_time: end,
      });
      sessions.push(s);
    }
  }

  return sessions;
}

exports.getUpcomingSessions = async (req, res) => {
  try {
    const now = new Date();
    const sessions = await ClassSession.findAll({
      where: {
        start_time: { [Op.gt]: now },
        status: 'scheduled',
      },
      include: [{ model: Class, as: 'class' }],
      order: [['start_time', 'ASC']],
    });
    res.json(sessions);
  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};


exports.createClass = async (req, res) => {
  try {
    const {
      name,
      type,
      title,
      subject,
      pricing,
      max_participants,
      datetime,
      duration,
      recurrence_rule,
      timezone,
    } = req.body;
    const teacherId = req.user.id;

    const cls = await Class.create({
      name: title || name,
      type,
      title,
      subject,
      pricing,
      max_participants,
      recurrence_rule,
      timezone,
      teacher_id: teacherId,
    });

    // also generate session(s)
    const sessions = await createSessionsForClass(cls, datetime, duration, recurrence_rule);

    res.status(201).json({ class: cls, sessions });
  } catch (err) {
    console.error('Create class error:', err);
    res.status(500).json({ error: 'Failed to create class' });
  }
};


exports.getMyClasses = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const classes = await Class.findAll({
      where: { teacher_id: teacherId },
      order: [['created_at', 'DESC']],
    });

    res.json(classes);
  } catch (err) {
    console.error('Get classes error:', err);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

exports.getStudentsInClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // Step 1: Get all student_ids from the join table
    const classStudents = await ClassStudent.findAll({
      where: { class_id: classId },
      attributes: ['student_id'],
    });

    const studentIds = classStudents.map(cs => cs.student_id);

    if (studentIds.length === 0) {
      return res.json([]); // No students in class
    }

    // Step 2: Fetch all students by ID
    const students = await Student.findAll({
      where: { id: studentIds },
    });

    // Step 3: Fetch users using user_ids from students
    const userIds = students.map(s => s.user_id);
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'email'],
    });

    const userMap = {};
    users.forEach(u => {
      userMap[u.id] = u;
    });

    // Step 4: Merge manually
    const result = students.map(s => ({
      id: s.id,
      full_name: s.full_name,
      email: userMap[s.user_id]?.email ?? null,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students manually' });
  }
};


exports.addStudentToClass = async (req, res) => {
  const { classId } = req.params;
  const { studentId } = req.body;

  const student = await Student.findOne({ where: { user_id: studentId } });
  if (!student) {
  return res.status(404).json({ error: 'Student not found for given userId' });
}


  try {
    const exists = await ClassStudent.findOne({
      where: { class_id: classId, student_id: student.id }
    });

    if (exists) {
      return res.status(400).json({ error: 'Student already in class' });
    }

    await ClassStudent.create({ class_id: classId, student_id: student.id });

    res.json({ message: 'Student added to class' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add student' });
  }
};

// Remove a student from a class
exports.removeStudentFromClass = async (req, res) => {
  const { classId } = req.params;
  const { studentId } = req.body;

  try {
    // Find the student by user_id or id
    let student = await Student.findOne({ where: { user_id: studentId } });
    if (!student) {
      student = await Student.findByPk(studentId);
    }
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Remove the student from the class
    const deleted = await ClassStudent.destroy({
      where: { class_id: classId, student_id: student.id }
    });

    if (deleted) {
      return res.json({ message: 'Student removed from class' });
    } else {
      return res.status(404).json({ error: 'Student not found in class' });
    }
  } catch (err) {
    console.error('Remove student error:', err);
    res.status(500).json({ error: 'Failed to remove student from class' });
  }
};

exports.getStudentClasses = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Find student by user_id
    const student = await Student.findOne({ where: { user_id: userId } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // 2. Get class IDs from ClassStudent table
    const classLinks = await ClassStudent.findAll({
      where: { student_id: student.id },
    });
    const classIds = classLinks.map(cs => cs.class_id);

    // 3. Fetch class details
    const classes = await Class.findAll({ where: { id: classIds } });

    // 4. Fetch teacher names manually
    const results = [];
    for (const c of classes) {
      console.log("c", c);
      console.log("Class:", c);
      const teacher = await Teacher.findOne({
        where: { user_id: c.teacher_id },
      });

      console.log("Teacher:", teacher);
      
      results.push({
        id: c.id,
        name: c.name,
        teacher_name: teacher?.full_name || 'Unknown',
      });
    }

    res.json(results);
  } catch (err) {
    console.error('Failed to get student classes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const { classId } = req.params;
    const cls = await Class.findByPk(classId);
    if (!cls) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(cls);
  } catch (err) {
    console.error('Get class details error:', err);
    res.status(500).json({ error: 'Failed to fetch class details' });
  }
};

exports.startClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user.id;
    const cls = await Class.findOne({ where: { id: classId, teacher_id: teacherId } });
    if (!cls) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (cls.status === 'running') {
      return res.json({ room_id: cls.room_id, room_password: cls.room_password, status: cls.status });
    }

    const livekit = require('./livekit.controller');
    const { room_id, room_password } = livekit.createRoomInternal();

    cls.room_id = room_id;
    cls.room_password = room_password;
    cls.status = 'running';
    await cls.save();

    res.json({ room_id, room_password, status: 'running' });
  } catch (err) {
    console.error('Start class error:', err);
    res.status(500).json({ error: 'Failed to start class' });
  }
};

exports.endClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user.id;
    const cls = await Class.findOne({
      where: { id: classId, teacher_id: teacherId },
    });
    if (!cls) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const livekit = require('./livekit.controller');
    if (cls.room_id && livekit.rooms[cls.room_id]) {
      delete livekit.rooms[cls.room_id];
    }

    cls.status = 'ended';
    cls.room_id = null;
    cls.room_password = null;
    await cls.save();

    res.json({ message: 'Class ended' });
  } catch (err) {
    console.error('End class error:', err);
    res.status(500).json({ error: 'Failed to end class' });
  }
};


