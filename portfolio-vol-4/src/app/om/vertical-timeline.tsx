'use client'
import { timelineData } from './data'
import TimelineItem from './timeline-item'
import { motion } from 'motion/react'

const Timeline = () => {
  return (
    <div className='flex justify-center items-center mb-10 flex-col gap-10 mt-20 sm:mt-0'>
        <motion.a 
          className="text-3xl flex flex-row gap-2 items-center duration-200 hover:font-medium w-fit hover:cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
            Jobberfaring
        </motion.a>
        <div>
        {timelineData.length > 0 &&
            timelineData.map((item, idx) => (
            <TimelineItem
                key={idx}
                title={item.title}
                description={item.description}
                date={item.date}
                id={item.id}
            />
        ))}
        </div>
    </div>
  )
}

export default Timeline