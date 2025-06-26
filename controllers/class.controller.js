const Class = require('../models/Class');

exports.createClass = async (req, res) => {
  try {
    const { name } = req.body;
    const teacherId = req.user.id;

    const newClass = await Class.create({
      name,
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

    const students = await Student.findAll({
      include: [
        {
          model: Class,
          where: { id: classId },
          through: { attributes: [] }, // exclude join table fields
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email'],
        },
      ],
    });

    const formatted = students.map(s => ({
      id: s.id,
      full_name: s.full_name,
      email: s.user?.email,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};


exports.addStudentToClass = async (req, res) => {
  const { classId } = req.params;
  const { studentId } = req.body;

  try {
    const exists = await ClassStudent.findOne({
      where: { class_id: classId, student_id: studentId }
    });

    if (exists) {
      return res.status(400).json({ error: 'Student already in class' });
    }

    await ClassStudent.create({ class_id: classId, student_id: studentId });

    res.json({ message: 'Student added to class' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add student' });
  }
};

