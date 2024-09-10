'use client'
import Image from "next/image";
import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import React from "react";

export const NumbersStream = (props: any) => {
  const getNewState = props.getNewState ?? function (s: Array<any>) { return [...s, "i"] }

  const disabled = props.disabled ?? false

  const [streamState, setStreamState] = useState(props.initial ?? [1])

  useEffect(() => {
    if (props.rerender && props.rerender.length > streamState.length)
    setStreamState(props.rerender)
  }, [props.rerender])

  const updateState = () => {
    if (disabled) return;
    const newState = getNewState(streamState)
    setStreamState(newState)
  }


  return <>
    {
      streamState.map((e : number, idx: number) => {
        if (streamState.length > 1 && idx === streamState.length - 1) {
          return <React.Fragment key={`stream-itm-${idx}`}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="stream-item">
              {e}
            </motion.div>
            <div className="stream-seperator">
              :
            </div>
          </React.Fragment>
        } else {
          return <React.Fragment key={`stream-itm-${idx}`}>
            <div
              className="stream-item">
              {e}
            </div>
            <div className="stream-seperator">
              :
            </div>
          </React.Fragment>
        }

        
      }
      )
    }
    <motion.div
      style={{ backgroundColor: props.backgroundColor ?? "#FC0F87" }}
      className="stream-lambda"
      whileHover={{ scale: 1.2, }}
      whileTap={{ scale: 0.8, backgroundColor: 'red'}}
      onClick={updateState}
    >
      λ
    </motion.div>
  </>
}

export const StaticNumbersStream = (props: any) => {
  let streamState = props.initial
  const collapse = props.collapse ?? false
  let collapsed = 0

  if (collapse && streamState.length > collapse) {
    let oldLen = streamState.length
    streamState = streamState.slice(-collapse)
    collapsed = oldLen - streamState.length
  }

  return <>
    {collapsed > 0 && <motion.div
      style={{ backgroundColor: props.backgroundColor ?? "#FC0F87", marginRight: 5}}
      className="stream-item"
      whileHover={{ scale: 1.2, }}
      whileTap={{ scale: 0.8, backgroundColor: 'red'}}
      onClick={props.force}
    >
      {collapsed}
    </motion.div>}
    {
      streamState.map((e : number, idx: number) => {
        return <React.Fragment key={`stream-itm-${idx}`}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="stream-item">
              {e}
            </motion.div>
            <div className="stream-seperator">
              :
            </div>
          </React.Fragment>
      }
      )
    }
    <motion.div
      style={{ backgroundColor: props.backgroundColor ?? "#FC0F87" }}
      className="stream-lambda"
      whileHover={{ scale: 1.2, }}
      whileTap={{ scale: 0.8, backgroundColor: 'red'}}
      onClick={props.force}
    >
      λ
    </motion.div>
  </>
}

export const LifeOfAStream = () => {
  return (
    <div className="main-container">
      <h1 className="title">Life of a Stream</h1>
      <div className="stream-container-centered">
        <NumbersStream initial={[1]} getNewState={(s: Array<number>) => [...s, s.length + 1]}/>
      </div>
    </div>
  );
}

export const Example1 = () => {

  const [blockStates, setBlockStates] = useState({ firstStream: [1], secondStream: undefined })

  const handleFirstStream = (s: Array<number>) => {
    const updatedBlockStates = {...blockStates}
    updatedBlockStates.firstStream = [...updatedBlockStates.firstStream, (updatedBlockStates.firstStream.length + 1)]
    setBlockStates(updatedBlockStates)
  }

  const handleSecondStream = (s: Array<number>) => {
    const updatedBlockStates = {...blockStates}

    const firstStreamLength = updatedBlockStates.firstStream.length
    const secondStreamLength = updatedBlockStates.secondStream.length

    if (firstStreamLength > secondStreamLength) {
      updatedBlockStates.secondStream = [...updatedBlockStates.secondStream, (secondStreamLength + 1) * 2]
    } else if (firstStreamLength === secondStreamLength) {
      updatedBlockStates.firstStream = [...updatedBlockStates.firstStream, (updatedBlockStates.firstStream.length + 1)]
      updatedBlockStates.secondStream = [...updatedBlockStates.secondStream, (updatedBlockStates.firstStream.length) * 2]
    }

    setBlockStates(updatedBlockStates)
  }

  const executeMap = () => {
    const updatedBlockStates = {...blockStates}
    updatedBlockStates.secondStream = [2]
    setBlockStates(updatedBlockStates)
  }

  return (
    <div className="main-container">
      <h1 className="title">Be Lazy!</h1>
      <div className="description">
        The map function takes a <b>stream</b> as <b style={{ color: "blue" }}>input</b> and returns a new stream as <b style={{ color: "green" }}>output</b>. <br></br> The resultant stream <b>forces</b> the original stream for answers (I mean values).
      </div>
      
      <div className="vertically-stacked">
        <div style={{ flex: 1}} />
          <div className="stream-container" style={{ justifyContent: "flex-end" }}>
            {
              blockStates.secondStream && 
                <StaticNumbersStream backgroundColor="green" initial={blockStates.secondStream} force={handleSecondStream}/>
            }

            {
              !blockStates.secondStream && 
              <span className="arrow gray-arrow">
              ?
              </span>
            }
            <span className="arrow gray-arrow">
            ←
            </span>
          </div>
        

        <div className="map-box" onClick={executeMap}>
          map <br/><br/>
          
          (λ e) e * 2
        </div>

        <div className="stream-container">
          <span className="arrow gray-arrow">
          ←
          </span>
          
          <StaticNumbersStream backgroundColor="blue" initial={blockStates.firstStream} force={handleFirstStream}/>
        </div>
        <div style={{ flex: 1}} />
      </div>
      <div className="description">
        <b>Time may not exist</b> : See how input stream is decoupled from the output stream! (forcing the input stream does not affect the output, but vice versa is not always true) <br/><br/> <br/>
      </div>
    </div>
  );
}

export const Example2 = () => {

  const [blockStates, setBlockStates] = useState({ firstStream: undefined, secondStream: undefined, thirdStream: undefined })

  function isPrime(num) {
    if (num <= 1) return false; // Numbers less than or equal to 1 are not prime
    if (num === 2) return true; // 2 is a prime number
    if (num % 2 === 0) return false; // Even numbers other than 2 are not prime

    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) {
            return false; // If divisible by any number, it's not prime
        }
    }
    return true; // Otherwise, it's prime 
  }

  const forceSecondStream = () => {
    const updatedBlockStates = {...blockStates}

    let lastPrime = updatedBlockStates.secondStream[updatedBlockStates.secondStream.length - 1]
    let remainingList = updatedBlockStates.firstStream.filter(e => e > lastPrime)

    // Some of the elements were already forced, no need to force anymore
    for (const e of remainingList) {
      if (isPrime(e)) {
        // Push new prime to the second stream
        updatedBlockStates.secondStream = [...updatedBlockStates.secondStream, e]
        setBlockStates(updatedBlockStates)
        return
      }
    }

    // In the already forced stream no primes were there, keep forcing until a new one is found
    while (true) {
      updatedBlockStates.firstStream = [...updatedBlockStates.firstStream, (updatedBlockStates.firstStream[updatedBlockStates.firstStream.length - 1] + 1)]
      const lastEle = updatedBlockStates.firstStream[updatedBlockStates.firstStream.length - 1]
      if (isPrime(lastEle)) {
        // Push new prime to the second stream
        updatedBlockStates.secondStream = [...updatedBlockStates.secondStream, lastEle]
        setBlockStates(updatedBlockStates)
        return
      }
      setBlockStates(updatedBlockStates)
    }
  }



  const createSecondStream = () => {
    const updatedBlockStates = {...blockStates}

    // Check if the first stream has 1007
    if (updatedBlockStates.firstStream.includes(10007)) {
      updatedBlockStates.secondStream = [10007]
      setBlockStates(updatedBlockStates)
      return
    }

    while (true) {
      updatedBlockStates.firstStream = [...updatedBlockStates.firstStream, (updatedBlockStates.firstStream[updatedBlockStates.firstStream.length - 1] + 1)]
      const lastEle = updatedBlockStates.firstStream[updatedBlockStates.firstStream.length - 1]
      if (isPrime(lastEle)) {
        // Push new prime to the second stream
        updatedBlockStates.secondStream = [lastEle]
        setBlockStates(updatedBlockStates)
        return
      }
      setBlockStates(updatedBlockStates)
    }
  }


  const forceFirstStream = () => {
    const updatedBlockStates = {...blockStates}
    updatedBlockStates.firstStream = [...updatedBlockStates.firstStream, (updatedBlockStates.firstStream[updatedBlockStates.firstStream.length - 1] + 1)]
    setBlockStates(updatedBlockStates)
  }

  const createFirstStream = () => {
    const updatedBlockStates = {}
    updatedBlockStates.firstStream = [10000]
    setBlockStates(updatedBlockStates)
  }


  return (
    <div className="main-container">
      <h1 className="title">Prime Number Stays Single!</h1>
      <div className="description">
        Running <b>filter</b> forces the input more than once, can you guess how many times it forces?
      </div>
      
      <div className="vertically-stacked">
        <div style={{ flex: 1}} />

        <div className="stream-container" style={{ justifyContent: "flex-end" }}>
          {
            blockStates.secondStream && 
            <StaticNumbersStream collapse={5} backgroundColor="green" initial={blockStates.secondStream} force={forceSecondStream}/>
          }
          {
            !blockStates.secondStream && 
            <span className="arrow gray-arrow">
            ?
            </span>
          }
          <span className="arrow gray-arrow">
            ←
          </span>
        </div>
        
        {
          blockStates.firstStream && 
          <div className="map-box" onClick={createSecondStream}>
            filter <br/><br/>
            
            (λ e) prime? e
          </div>
        }

        {
          blockStates.firstStream && 
          <div className="stream-container">
            <span className="arrow gray-arrow">
            ←
            </span>
            <StaticNumbersStream collapse={15} backgroundColor="blue" initial={blockStates.firstStream} force={forceFirstStream}/>
            <span className="arrow gray-arrow">
            ←
            </span>
          </div>
        }

        <div className="map-box" onClick={createFirstStream}>
          stream-enumerate-interval <br/><br/>
          10000 1000000
        </div>
        <div style={{ flex: 1}} />
      </div>
      <div className="description">
        <br/>
        <b>Memory Usage:</b> FirstStream -- {blockStates.firstStream ? blockStates.firstStream.length : 0} SecondStream -- {blockStates.secondStream ? blockStates.secondStream.length : 0} <br/> <br/>
      </div>
    </div>
  );
}

export const Example3 = () => {

  const [blockStates, setBlockStates] = useState({ firstStream: undefined, secondStream: undefined, thirdStream: undefined, finalValue: undefined })

  function isPrime(num) {
    if (num <= 1) return false; // Numbers less than or equal to 1 are not prime
    if (num === 2) return true; // 2 is a prime number
    if (num % 2 === 0) return false; // Even numbers other than 2 are not prime

    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) {
            return false; // If divisible by any number, it's not prime
        }
    }
    return true; // Otherwise, it's prime 
  }

  const forceThirdStream = (doNotUpdate = false, existingBS) => {
    let updatedBlockStates = {...(existingBS ? existingBS : blockStates)}
    updatedBlockStates = forceSecondStream(true, updatedBlockStates)
    updatedBlockStates.thirdStream = updatedBlockStates.secondStream.slice(1)
    if (doNotUpdate === true) return updatedBlockStates
    setBlockStates(updatedBlockStates)
  }

  const createThirdStream = () => {
    let updatedBlockStates = {firstStream: blockStates.firstStream, secondStream: blockStates.secondStream, thirdStream: undefined, finalValue: undefined}

    // Second stream must be of length atleast one
    while (updatedBlockStates.secondStream.length < 2)
      updatedBlockStates = forceSecondStream(true, updatedBlockStates)

    updatedBlockStates.thirdStream = updatedBlockStates.secondStream.slice(1)
    setBlockStates(updatedBlockStates)
    return
  }

  const forceSecondStream = (doNotUpdate = false, existingBS) => {
    let updatedBlockStates = {...(existingBS ? existingBS : blockStates)}

    // First stream have been forced before itself, see if existing forces revealed any prime
    let lastPrime = updatedBlockStates.secondStream[updatedBlockStates.secondStream.length - 1]
    let remainingList = updatedBlockStates.firstStream.filter(e => e > lastPrime)

    // Some of the elements were already forced, no need to force anymore
    for (const e of remainingList) {
      if (isPrime(e)) {
        // Push new prime to the second stream
        updatedBlockStates.secondStream = [...updatedBlockStates.secondStream, e]
        if (doNotUpdate === true) return updatedBlockStates
        setBlockStates(updatedBlockStates)
        return updatedBlockStates
      }
    }

    let resPrime = 0
    do {
      updatedBlockStates = forceFirstStream(true, updatedBlockStates)
      resPrime = updatedBlockStates.firstStream[updatedBlockStates.firstStream.length - 1]
    } while(!isPrime(resPrime))

    updatedBlockStates.secondStream = [...updatedBlockStates.secondStream, resPrime]
    
    if (doNotUpdate === true) return updatedBlockStates
    setBlockStates(updatedBlockStates)
  }

  const createSecondStream = () => {
    let updatedBlockStates = {firstStream: blockStates.firstStream, secondStream: undefined, thirdStream: undefined, finalValue: undefined}

    // If the first stream does not have 10007, force it until it does
    while (!updatedBlockStates.firstStream.includes(10007))
      updatedBlockStates = forceFirstStream(true, updatedBlockStates)

    updatedBlockStates.secondStream = [10007]
    setBlockStates(updatedBlockStates)
    return
  }


  const forceFirstStream = (doNotUpdate = false, existingBS) => {
    const updatedBlockStates = {...(existingBS ? existingBS : blockStates)}
    updatedBlockStates.firstStream = [...updatedBlockStates.firstStream, (updatedBlockStates.firstStream[updatedBlockStates.firstStream.length - 1] + 1)]
    if (doNotUpdate === true) return updatedBlockStates
    setBlockStates(updatedBlockStates)
  }

  const createFirstStream = () => {
    const updatedBlockStates = {firstStream: undefined, secondStream: undefined, thirdStream: undefined, finalValue: undefined}
    updatedBlockStates.firstStream = [10000]
    setBlockStates(updatedBlockStates)
  }

  const createFinalValue = () => {
    const updatedBlockStates = {...blockStates}
    updatedBlockStates.finalValue = updatedBlockStates.thirdStream[0]
    setBlockStates(updatedBlockStates)
  }


  return (
    <div className="main-container">
      <h1 className="title">Life is not a race, be lazy (;))</h1>
      <div className="description">
        Programs must be written for people to read, <br/> and only incidentally for machines to execute. ~ SICP
      </div>
      
      <div className="vertically-stacked">
        <div style={{ flex: 1}} />

        {
          blockStates.thirdStream && 
          <div className="stream-container" style={{ justifyContent: "flex-end" }}>

            {
              blockStates.finalValue && 
                <div
                  className="stream-item">
                  {blockStates.finalValue}
                </div>
            }
            {
              !blockStates.finalValue && 
              <span className="arrow gray-arrow">
              ?
              </span>
            }
            <span className="arrow gray-arrow">
              ←
            </span>
          </div>
        }

        {
          blockStates.thirdStream && 
          <div className="map-box" onClick={createFinalValue}>
            car <br/><br/>
            
            λou know this too :)
          </div>
        }

        {
          blockStates.secondStream && 
          <div className="stream-container" style={{ justifyContent: "flex-end" }}>
            {
              blockStates.thirdStream && 
              <span className="arrow gray-arrow">
                ←
              </span>
            }
            {
              blockStates.thirdStream && 
              <StaticNumbersStream  backgroundColor="green" initial={blockStates.thirdStream} force={forceThirdStream}/>
            }
            {
              !blockStates.thirdStream && 
              <span className="arrow gray-arrow">
              ?
              </span>
            }
            {
              blockStates.secondStream && 
              <span className="arrow gray-arrow">
                ←
              </span>
            }
          </div>
        }

        
        {
          blockStates.secondStream && 
          <div className="map-box" onClick={createThirdStream}>
            cdr <br/><br/>
            
            λou know this 
          </div>
        }

        <div className="stream-container" style={{ justifyContent: "flex-end" }}>
          {
            blockStates.secondStream && 
            <span className="arrow gray-arrow">
              ←
            </span>
          }
          {
            blockStates.secondStream && 
            <StaticNumbersStream backgroundColor="green" initial={blockStates.secondStream} force={forceSecondStream}/>
          }
          {
            !blockStates.secondStream && 
            <span className="arrow gray-arrow">
            ?
            </span>
          }
          <span className="arrow gray-arrow">
            ←
          </span>
        </div>
        
        {
          blockStates.firstStream && 
          <div className="map-box" onClick={createSecondStream}>
            filter <br/><br/>
            
            (λ e) prime? e
          </div>
        }

        {
          blockStates.firstStream && 
          <div className="stream-container">
            <span className="arrow gray-arrow">
            ←
            </span>
            <StaticNumbersStream backgroundColor="blue" initial={blockStates.firstStream} force={forceFirstStream}/>
            <span className="arrow gray-arrow">
            ←
            </span>
          </div>
        }

        <div className="map-box" onClick={createFirstStream}>
          stream-enumerate-interval <br/><br/>
          10000 1000000
        </div>
        <div style={{ flex: 1}} />
      </div>
      <div className="description">
        <b>Memory Usage:</b> FirstStream -- {blockStates.firstStream ? blockStates.firstStream.length : 0} SecondStream -- {blockStates.secondStream ? blockStates.secondStream.length : 0} <br/>
        <br/>
          Notice how the output of cdr is not really a <b>new</b> strem
        <br/>
        <br/>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <LifeOfAStream/>
      <Example1/>
      <Example2/>
      <Example3/>
    </>
  );
}
