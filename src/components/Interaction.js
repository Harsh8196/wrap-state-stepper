import React, { useState, useEffect } from 'react';
import '../css/Home.css'
import wrap_svg from '../assets/icons/warp–logo.svg'
import arweave_svg from '../assets/icons/arweave-ar-logo.svg'
import { Link, useLocation } from 'react-router-dom';

const Interaction = () => {
  const [contractsArray, setContractsArray] = useState([]);
  const [interactionsArray, setInteractionsArray] = useState([]);
  const location = useLocation()

  useEffect(() => {
    if (localStorage.getItem("selectedNetworks")) {
      getAllContracts(localStorage.getItem("selectedNetworks"))
    }
  }, [location.key])

  const ContractComponent = function () {
    return (
      contractsArray.map(contract => {
        let sourceSVG, contractLink
        if (contract.source === "warp") {
          sourceSVG = wrap_svg
        } else {
          sourceSVG = arweave_svg
        }
        contractLink = `/contract/${contract.contract_id}`
        return (
          <div>
            <div className='row align-items-center'>
              <div className='col-1'>
                <img src={sourceSVG} alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
              </div>
              <div className='col-11'>
                <div className='row'>
                  <div className="col-3">
                    <span className='fw-light text-secondary'>Contract</span>
                  </div>
                  <div className="col-9">
                    <Link className='fw-semibold w-text-primary text-decoration-none' to={contractLink}>{contract.contract_id}</Link>
                  </div>
                </div>
                <div className='row'>
                  <div className="col-3">
                    <span className='fw-light text-secondary'>Creator</span>
                  </div>
                  <div className="col-9">
                    <span className='fw-light text-secondary fw-semibold'>{contract.owner}</span>
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </div>
        )
      })
    )
  }

  const InteractionComponent = function () {
    return (
      interactionsArray.map(interaction => {
        let interactionLink = `/contract/${interaction.contract_id}/${interaction.interaction_id}`
        return (
          <div>
            <div className='row align-items-center'>
              <div className='col-1'>
                <i alt="Logo" width="24" height="24" className="d-inline-block align-text-top bi bi-check-circle-fill fs-4" />
              </div>
              <div className='col-11'>
                <div className='row'>
                  <div className="col-3">
                    <span className='fw-light text-secondary'>Interaction</span>
                  </div>
                  <div className="col-9">
                    <Link className='fw-semibold w-text-primary text-decoration-none' to={interactionLink}>{interaction.interaction_id}</Link>
                  </div>
                </div>
                <div className='row'>
                  <div className="col-3">
                    <span className='fw-light text-secondary'>Contract</span>
                  </div>
                  <div className="col-9">
                    <span className='fw-light text-secondary fw-semibold'>{interaction.contract_id}</span>
                  </div>
                </div>
                <div className='row'>
                  <div className="col-3">
                    <span className='fw-light text-secondary'>Function</span>
                  </div>
                  <div className="col-9">
                    <span className='fw-light text-secondary'>{interaction.function}</span>
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </div>
        )
      })
    )
  }

  const getAllContracts = async function (network) {
    let fetchURL
    if (network === "Testnet") {
      fetchURL = 'https://gw.warp.cc/sonar/gateway/dashboard?contractLimit=100&interactionLimit=500&testnet=true'
    } else {
      fetchURL = 'https://gw.warp.cc/sonar/gateway/dashboard?contractLimit=100&interactionLimit=500'
    }
    const response = await fetch(fetchURL);
    const result = await response.json();
    const contract = result.contracts
    setContractsArray(contract.filter(contract => {
      return contract.contract_or_interaction === "contract"
    }));
    setInteractionsArray(contract.filter(contract => {
      return contract.contract_or_interaction === "interaction"
    }));
    // console.log(contract);
  }

  return (
    <div className='d-flex justify-content-center flex-column align-items-center'>
      <div classNameName='container-fluid' style={{ "width": "90%" }}>
        <div className='row mt-5 mb-5'>
          <div className="col-md-6 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-header fw-semibold text-secondary">
                Latest Top 100 Contract
              </div>
              <div className="card-body scrollarea" style={{ "height": "calc(100vh - 100px)" }}>
                <ContractComponent />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-header fw-semibold text-secondary">
                Latest Top 500 Interaction
              </div>
              <div className="card-body scrollarea" style={{ "height": "calc(100vh - 100px)" }}>
                <InteractionComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interaction;
