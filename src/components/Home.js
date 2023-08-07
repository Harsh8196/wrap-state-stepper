import React, { useState, useEffect } from 'react';
import '../css/Home.css'
import wrap_svg from '../assets/icons/warp–logo.svg'
import arweave_svg from '../assets/icons/arweave-ar-logo.svg'
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
    const [contractsArray, setContractsArray] = useState([]);
    const [interactionsArray, setInteractionsArray] = useState([]);
    const [ARPrice,setARPrice] = useState('');
    const [ARMarketCap,setMarketCap] = useState('');
    const [MarketCapInAR,setMarketCapInAR] = useState('');
    const [totalHeight,setTotalHeight] = useState('');
    const [totalBlocks,setTotalBlocks] = useState('');
    const [totalInteraction,setTotalInteraction] = useState('');
    const [totalContract,setTotalContract] = useState('');
    const location = useLocation()


    useEffect(() => {
        if (localStorage.getItem("selectedNetworks")) {
            getAllContracts(localStorage.getItem("selectedNetworks"))
            getARDetails()
            getGatewayInfo()
            getStats()
        }
    }, [location.key])

    const getARDetails = async function(){
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd&include_market_cap=true");
        const data = await response.json();
        setARPrice(Math.round((data.arweave.usd + Number.EPSILON) * 100 )/100);
        setMarketCap(Math.round((data.arweave.usd_market_cap + Number.EPSILON) * 100)/100);
        setMarketCapInAR(Math.round(((data.arweave.usd_market_cap/data.arweave.usd)+ Number.EPSILON) * 100)/100);
    }

    const getGatewayInfo = async function(){
        const response = await fetch("https://gateway.warp.cc/gateway/arweave/info");
        const data = await response.json();
        setTotalHeight(data.height);
        setTotalBlocks(data.blocks);
    }

    const getStats = async function(){
        let statsURL
        if(localStorage.getItem("selectedNetworks") === "Mainnet"){
            statsURL = "https://gateway.warp.cc/gateway/stats"
        }else{
            statsURL = "https://gateway.warp.cc/gateway/stats?testnet=true"
        }
        const response = await fetch(statsURL);
        const data = await response.json();
        setTotalInteraction(data.total_interactions);
        setTotalContract(data.total_contracts);
    }

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
            fetchURL = 'https://gw.warp.cc/sonar/gateway/dashboard?contractLimit=15&interactionLimit=15&testnet=true'
        } else {
            fetchURL = 'https://gw.warp.cc/sonar/gateway/dashboard?contractLimit=15&interactionLimit=15'
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
                <div className='card mt-5 shadow-sm'>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 col-lg-4">
                                <div className='media align-items-center'>
                                    <img src={arweave_svg} alt="Logo" width="24" height="24" className="d-inline-block align-text-top me-2" />
                                    <div className='media-body'>
                                        <h2 className='fw-light text-secondary font-size-1 text-uppercase mb-0'>ARWEAVE PRICE</h2>
                                        <span className='fw-light'>${ARPrice}</span>
                                    </div>
                                </div>
                                <hr />
                                <div className='media align-items-center'>
                                    <i alt="Logo" width="24" height="24" className="d-inline-block align-text-top me-2 bi bi-globe-asia-australia fs-3" />
                                    <div className='media-body'>
                                        <h2 className='fw-light text-secondary font-size-1 text-uppercase mb-0'>ARWEAVE MARKET CAP</h2>
                                        <span className='fw-light text-size-1'>${ARMarketCap}</span>
                                        <span className='fw-light text-secondary'> ({MarketCapInAR} AR)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-4 u-ver-divider u-ver-divider--left u-ver-divider--none-md">
                                <div className='media align-items-center ms-4'>
                                    <i alt="Logo" width="24" height="24" className="d-inline-block align-text-top me-2 bi bi-file-earmark-text-fill fs-3" />
                                    <div className='media-body'>
                                        <h2 className='fw-light text-secondary font-size-1 text-uppercase mb-0'>TOTAL CONTRACT</h2>
                                        <span className='fw-light'>{totalContract}</span>
                                    </div>
                                </div>
                                <hr className='ms-lg-4' />
                                <div className='media align-items-center ms-4'>
                                    <i alt="Logo" width="24" height="24" className="d-inline-block align-text-top me-2 bi bi-check-circle-fill fs-3" />
                                    <div className='media-body'>
                                        <h2 className='fw-light text-secondary font-size-1 text-uppercase mb-0'>TOTAL INTERACTION</h2>
                                        <span className='fw-light text-size-1'>{totalInteraction}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-4 u-ver-divider u-ver-divider--left u-ver-divider--none-md">
                                <div className='media align-items-center ms-4'>
                                    <i alt="Logo" width="24" height="24" className="d-inline-block align-text-top me-2 bi bi-bookshelf fs-3" />
                                    <div className='media-body'>
                                        <h2 className='fw-light text-secondary font-size-1 text-uppercase mb-0'>TOTAL HEIGHT</h2>
                                        <span className='fw-light'>{totalHeight}</span>
                                    </div>
                                </div>
                                <hr className='ms-lg-4' />
                                <div className='media align-items-center ms-4'>
                                    <i alt="Logo" width="24" height="24" className="d-inline-block align-text-top me-2 bi bi-archive-fill fs-3" />
                                    <div className='media-body'>
                                        <h2 className='fw-light text-secondary font-size-1 text-uppercase mb-0'>TOTAL BLOCKS</h2>
                                        <span className='fw-light text-size-1'>{totalBlocks}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row mt-5 mb-5'>
                    <div className="col-md-6 col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-header fw-semibold text-secondary">
                                Latest Contract
                            </div>
                            <div className="card-body h-100 scrollarea">
                                <ContractComponent />
                            </div>
                            <Link to={'/allinteraction'} className="card-footer w-text-primary text-center">
                                View all contract
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-header fw-semibold text-secondary">
                                Latest Interaction
                            </div>
                            <div className="card-body h-100 scrollarea">
                                <InteractionComponent/>
                            </div>
                            <Link to={'/allinteraction'} className="card-footer w-text-primary text-center">
                                View all interaction
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;
