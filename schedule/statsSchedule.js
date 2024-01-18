const schedule = require('node-schedule')


module.exports = app =>{
    schedule.scheduleJob('*/1 * * * *', async function () {
        const studentCount = await app.db('users').where({teacher:false}).count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const coursesCount = await app.db('courses').count('id').first()
        const teacherCount = await app.db('users').where({teacher: true}).count('id').first()

        const { Stat } = app.api.stats

        const lastStat = await Stat.findOne({}, {}, { sort: { 'createdAt' : -1 } })

        const stat = new Stat({
            categories: categoriesCount.count,
            teachers: teacherCount.count,
            students: studentCount.count,
            courses: coursesCount.count,
            createdAt: new Date()

        })

        const changeStudents =! lastStat || stat.students !== lastStat.students
        const changeTeachers =! lastStat || stat.teachers !== lastStat.teachers
        const changeCategories =! lastStat || stat.categories !== lastStat.categories
        const changeCourses =! lastStat || stat.courses !== lastStat.courses

        if (changeStudents || changeTeachers || changeCategories || changeCourses) {
            stat.save().then(()=> console.log('[Stats] Estatísticas actualizadas'))
        }

    } )
}