import React, { useCallback, useEffect, useRef, useState } from 'react'
// import './App.css'
import { paragraphs } from './paragraphs'
import Content from './content'

let ranIndex = Math.floor(Math.random() * paragraphs.length);

const App = () => {

  const maxTime = 60
  const [paragraph, setParagraph] = useState(paragraphs[ranIndex])
  const [word, setWord] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const [time, setTime] = useState(maxTime)
  const [mistake, setMistake] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [cpm, setCpm] = useState(0)
  const [acc, setAcc] = useState(0)

  const totalChars = useRef(0)
  const totalCorrectChars = useRef(0)
  const elapsedTime = useRef(0)
  const timer = useRef()

  const callbackRef = useCallback(inputEl => {
    if (inputEl) {
      document.addEventListener("keydown", () => inputEl.focus())
    }
  }, [])

  useEffect(() => {
    if (timer.current && time > 0) {
      timer.current = setTimeout(() => {
        setTime(t => t - 1)
        elapsedTime.current += 1;
        updateCpmWpm();
      }, 1000)
    }

    if (time <= 0) {
      clearTimeout(timer.current);
      return;
    }
  }, [time])

  const handleInput = (e) => {
    const { value } = e.target;

    if (time <= 0 || value.length > paragraph.length) {
      return;
    }

    setWord(value)
    setCharIndex(value.length)

    const { mistake } = testCalculator(paragraph, value)

    setMistake(mistake)

    TestAccuracy(value, paragraph)

    if (!timer.current) {
      timer.current = setTimeout(() => {
        setTime(t => t - 1)
        elapsedTime.current += 1;
        updateCpmWpm();
      }, 1000)
    }
  }

  function testCalculator(originalValue, typedValue) {
    const mistake = typedValue.split('').reduce((acc, typedChar, index) => {
      return typedChar !== originalValue[index] ? acc + 1 : acc
    }, 0)

    return { mistake }
  }

  function TestAccuracy(value, paragraph) {
    if (value.length > charIndex) {
      totalChars.current += 1;
      if (value[charIndex] === paragraph[charIndex]) {
        totalCorrectChars.current += 1;
      }
      setAcc(totalCorrectChars.current / totalChars.current * 100)
    }
  }

  function updateCpmWpm() {
    const correctChars = totalCorrectChars.current;
    const elapsedMinutes = elapsedTime.current / 60;
    const cpm = elapsedMinutes > 0 ? (correctChars / elapsedMinutes) : 0;
    const wpm = elapsedMinutes > 0 ? (correctChars / 5 / elapsedMinutes) : 0;

    setCpm(cpm);
    setWpm(wpm);
  }

  const handleTryAgain = () => {
    if (time > 0) return;
    handleReset();
  }

  function handleReset() {
    setWord('')
    setCharIndex(0)
    setTime(maxTime)
    setMistake(0)
    setWpm(0)
    setCpm(0)
    setAcc(0)
    clearTimeout(timer.current)

    totalChars.current = 0
    totalCorrectChars.current = 0
    elapsedTime.current = 0
    timer.current = undefined
  }

  function handleRestart() {
    let ri = Math.floor(Math.random() * paragraphs.length);

    if (ri !== ranIndex) {
      ranIndex = ri
      setParagraph(paragraphs[ri])
      handleReset()
    }
    else {
      handleRestart()
    }
  }

  return (
    <div className='m-5 flex flex-col justify-center items-center'>
      <h1 className='font-poppins text-3xl m-5 font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#000000] to-[#7e7e7e]'>TypeZone</h1>
      <h2 className='font-poppins text-2xl m-5 font-light bg-clip-text text-transparent bg-gradient-to-r from-[#000000] to-[#7e7e7e]'>Unleash Your Typing Wizardry</h2>
      <div className='flex gap-10 text-lg font-poppins m-5 '>
        <div className='flex flex-col justify-center items-center bg-black text-white p-5 rounded-full ' onClick={handleTryAgain}>
          {
            time > 0
              ? <>
                <p className='text-xl'>{time}</p>
                <small>seconds</small>
              </>
              : <small>Try Again!</small>
          }
        </div>

        <div className='rounded-2xl flex flex-col justify-center items-center bg-black text-white p-5  '>
          <p className='text-xl'>{Math.floor(wpm)}</p>
          <small>words/min</small>
        </div>

        <div className='rounded-2xl flex flex-col justify-center items-center bg-black text-white p-5  '>
          <p className='text-xl'>{Math.floor(cpm)}</p>
          <small>chars/min</small>
        </div>

        <div className='rounded-2xl flex flex-col justify-center items-center bg-black text-white p-5  '>
          <p className='text-xl'>{mistake}</p>
          <small>mistakes</small>
        </div>

        <div className='rounded-2xl flex flex-col justify-center items-center bg-black text-white p-5  '>
          <p className='text-xl'>{Math.round(acc)}%</p>
          <small>accuracy</small>
        </div>
      </div>

      <input type="text" value={word} autoFocus
        onChange={handleInput} ref={callbackRef} style={{ opacity: 0 }} />

      <Content paragraph={paragraph} word={word} charIndex={charIndex} />

      <span className='m-5 rounded-full cursor-pointer pt-2 p-3 text-3xl bg-gray-200 hover:bg-gray-300 transition-all ease-in-out duration-300' onClick={handleRestart}>&#x27F3;</span>
    </div>
  )
}

export default App
