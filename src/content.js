import React from 'react'

const content = React.memo(({paragraph,word,charIndex}) => {
  return (
    <div className='mx-10 font-poppins text-2xl'>
        {
          paragraph.split('').map((char,index)=>(
            <span 
              key={index} 
              className={`
              text-[#9a9a9a] mx-[3px]
              ${index === charIndex ? 'text-[#3295db] border-[#3295db] border-b-[2px] ' : ''}
              ${word[index] === char 
                ? 'text-[#95c590] ' 
                : index<charIndex ? 'text-[#d55b60] ' : ''
              }
              `}>
              {char}
            </span>
          ))
        } 
    </div>
  )
})

export default content