import React, { useEffect, useState } from 'react';
import '../css/Contract.css'
import { JsonViewer } from '@textea/json-viewer'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import readContract from '../script/warpContract';

const Contract = () => {
  const { id, inx } = useParams()
  const location = useLocation();
  const navigate = useNavigate();
  const [interactionArray, setInteractionsArray] = useState([])
  const [initialState, setInitialState] = useState({})
  const [currentState, setCurrentState] = useState({})
  const [inputFunction, setInputFunction] = useState({})
  const [error, setError] = useState('No Error')
  const [shortKey, setShortKey] = useState('')

  useEffect(() => {
    if(inx){
      
      getAllInteractions()
      getCurrentState()

    }else{
      getInitialState()
      getAllInteractions()
    }
  }, [])

  useEffect(() => {
    if (inx) {
      getCurrentState()
    }
  }, [location.key])

  const getCurrentState = async function(){
    let response = await fetch(`https://gateway.warp.cc/gateway/contract?txId=${id}`)
    let data = await response.json()
    let _evaluationOptions = {}
    // console.log('initial state', data.initState)
    setInitialState(data.initState)
    if (data.manifest) {
      _evaluationOptions = data.manifest.evaluationOptions
      // console.log('evaluation options', data.manifest.evaluationOptions)
    }
    let _response = await fetch(`https://gateway.warp.cc/gateway/interactions/${inx}`)
    let _data = await _response.json()
      // console.log('current state', _data)
      setInputFunction(JSON.parse(_data.input))
      if (_data.sortkey) {
        setShortKey(_data.sortkey)
        const cachedState = await readContract(localStorage.getItem("selectedNetworks"), id, inx, _data.sortkey, _evaluationOptions)
        // console.log('cached state', cachedState)
        setCurrentState(cachedState.state)
        if (cachedState.errorMessages) {
          setError(cachedState.errorMessages)
        }else{
          setError('No Error')
        }
      }
  }

  const getAllInteractions = async function () {
    const response = await fetch(`https://gateway.warp.cc/gateway/interactions?contractId=${id}`)
    const data = await response.json()
    // console.log(data, 'data')
    const dataArray = data.interactions;
    const interactions = []
    if (dataArray.length > 0) {
      dataArray.forEach(element => {
        interactions.push(element.interaction.id)
      })
      // console.log(interactions, 'interactions')
      setInteractionsArray(interactions)
    } else {
      alert('Contract has no interactions!')
      navigate('/')
    }
  }

  const getInitialState = async function () {
    const response = await fetch(`https://gateway.warp.cc/gateway/contract?txId=${id}`)
    const data = await response.json()
    // console.log('initial state', data.initState)
    setInitialState(data.initState)
  }

  const InputFunctionComponent = function () {
    return (
      <JsonViewer value={inputFunction} />
    )
  }

  const CurrentStateComponent = function () {
    return (
      <JsonViewer value={currentState} />
    )
  }

  const InitialStateComponent = function () {
    return (
      <JsonViewer value={initialState} />
    )
  }

  const InteractionList = function () {
    return (
      interactionArray.map(interaction => {
        let classNameIn
        if (interaction === inx) {
          classNameIn = "nav-link active px-2 py-3"
        } else {
          classNameIn = "nav-link link-body-emphasis"
        }
        return (

          <li className="nav-item">
            <Link to={`/contract/${id}/${interaction}`} className={classNameIn} style={{ "fontSize": "0.7rem" }}>
              <i className="bi bi-check-circle-fill me-1"></i>
              {interaction}
            </Link>
          </li>

        )
      }
      )
    )
  }

  return (
      <div className='d-flex flex-nowrap'>
        <div className="d-flex flex-column flex-shrink-0 p-2 bg-body-tertiary" style={{ "width": "auto", "height": "calc(100vh - 70px)" }}>
          <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            <span className="fs-4">Contract</span>
          </div>
          <div className="nav-link link-body-emphasis" style={{ "fontSize": "0.7rem" }} aria-current="page">
            {id}
          </div>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto scrollarea flex-nowrap">
            <InteractionList />
          </ul>
        </div>
        <div className="b-contract-divider b-contract-vr"></div>
        <div classNameName='container-fluid'>
          <div className='row mx-2 scrollarea' style={{ "height": "calc(100vh - 70px)" }}>
            <div className='col-md-12 col-lg-12 mt-3'>
              <div className="card">
                <div className="row g-0">
                  <div className="col-md-6">
                    <div className="card-body">
                      <h5 className="card-title fw-semibold text-secondary">Contract Id</h5>
                      <p className="card-text text-size-2">{id}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-body">
                      <h5 className="card-title fw-semibold text-secondary">Interaction Id</h5>
                      <p className="card-text text-size-2">{inx}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-12 col-lg-12 mt-3'>
              <div className="card">
                <div className="card-header fw-semibold text-secondary">
                  Initial State
                </div>
                <div className="row g-0 align-items-center">
                  <div className="col-md-2">
                    <div className="card-body">
                      <span className="card-text text-secondary fw-semibold">State:</span>
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="card-body scrollarea" style={{ "height": "200px" }}>
                      <InitialStateComponent />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-12 col-lg-12 mt-3 mb-5' hidden={!inx}>
              <div className="card">
                <div className="card-header fw-semibold text-secondary">
                  Current State
                </div>
                <div className="row g-0 align-items-center">
                  <div className="col-md-2">
                    <div className="card-body">
                      <span className="card-text text-success fw-semibold">Input:</span>
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="card-body border border-secondary-subtle scrollarea rounded m-1" style={{ "height": "150px" }}>
                      <InputFunctionComponent />
                    </div>
                  </div>
                </div>
                <div className="row g-0 align-items-center">
                  <div className="col-md-2">
                    <div className="card-body">
                      <span className="card-text fw-semibold text-secondary">Short Key:</span>
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="card-body">
                      <span className="card-text text-secondary">{shortKey}</span>
                    </div>
                  </div>
                </div>
                <div className="row g-0 align-items-center">
                  <div className="col-md-2">
                    <div className="card-body">
                      <span className="card-text text-danger fw-semibold">Error:</span>
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="card-body">
                      <span className="card-text text-secondary">{error}</span>
                    </div>
                  </div>
                </div>
                <div className="row g-0 align-items-center">
                  <div className="col-md-2">
                    <div className="card-body">
                      <span className="card-text text-secondary fw-semibold">State:</span>
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="card-body scrollarea border border-secondary-subtle rounded m-1" style={{ "height": "210px" }}>
                      <CurrentStateComponent />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Contract;
