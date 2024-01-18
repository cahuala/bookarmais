/*module.exports = app => {
    const Stat = app.mongoose.model('Stat', {
        categories: Number,
        teachers: Number,
        students: Number,
        courses: Number,
        createdAt: Date
    })
    const get = (req, res) => {
        Stat.findOne({},{}, { sort: { 'createdAt' : -1 } })
        .then(stat=>{
            const defaultStats = {
                        categories: 0,
                        teachers: 0,
                        students: 0,
                        courses: 0,
            }
            res.json(stat || defaultStats)
        })
    }

    return { Stat , get }
}*/