import React from 'react'

const content = React.memo(({paragraph,word,charIndex}) => {
  return (
    <div className='content'>
        {
          paragraph.split('').map((char,index)=>(
            <span 
              key={index} 
              className={`
              char
              ${index === charIndex ? 'active' : ''}
              ${word[index] === char 
                ? 'correct' 
                : index<charIndex ? 'incorrect' : ''
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