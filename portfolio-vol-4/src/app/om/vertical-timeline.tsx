import { timelineData } from './data'
import TimelineItem from './timeline-item'

const Timeline = () => {
  return (
    <div className='flex justify-center items-center mb-10 flex-col gap-10'>
        <a className="text-3xl flex flex-row gap-2 items-center duration-200 hover:font-medium w-fit hover:cursor-pointer">
            Jobberfaring
        </a>
        <div>
        {timelineData.length > 0 &&
            timelineData.map((item, idx) => (
            <TimelineItem
                key={idx}
                title={item.title}
                description={item.description}
                date={item.date}
            />
        ))}
        </div>
    </div>
  )
}

export default Timeline