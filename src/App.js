import React, { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
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
    <div className='App'>
      <h1>Typing Speed Test</h1>
      <h2>Test Your Typing Skill</h2>
      <div className='tab'>
        <div className='timer' onClick={handleTryAgain}>
          {
            time > 0
              ? <>
                <p>{time}</p>
                <small>seconds</small>
              </>
              : <small>Try Again!</small>
          }
        </div>

        <div className='square'>
          <p>{Math.floor(wpm)}</p>
          <small>words/min</small>
        </div>

        <div className='square'>
          <p>{Math.floor(cpm)}</p>
          <small>chars/min</small>
        </div>

        <div className='square'>
          <p>{mistake}</p>
          <small>mistakes</small>
        </div>

        <div className='square'>
          <p>{Math.round(acc)}</p>
          <small>% accuracy</small>
        </div>
      </div>

      <input type="text" value={word} autoFocus
        onChange={handleInput} ref={callbackRef} style={{ opacity: 0 }} />

      <Content paragraph={paragraph} word={word} charIndex={charIndex} />

      <span className='restart' onClick={handleRestart}>&#x27F3;</span>
    </div>
  )
}

export default App
