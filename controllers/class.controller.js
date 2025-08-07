const Class = require('../models/Class');
const ClassStudent = require('../models/ClassStudent');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

exports.createClass = async (req, res) => {
  try {
    const {
      name,
      type,
      title,
      datetime,
      duration,
      subject,
      pricing,
      max_participants,
      recurrence,
    } = req.body;
    const teacherId = req.user.id;

    const newClass = await Class.create({
      name: title || name,
      type,
      title,
      datetime,
      duration,
      subject,
      pricing,
      max_participants,
      recurrence,
      teacher_id: teacherId,
    });

    res.status(201).json(newClass);
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


