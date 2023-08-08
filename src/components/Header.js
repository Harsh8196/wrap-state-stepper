import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [network,setNetworks] = useState('Mainnet')
    const [search,setSearch] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("selectedNetworks")){
            setNetworks(localStorage.getItem("selectedNetworks"));
        } else{
            localStorage.setItem("selectedNetworks",'Mainnet');
        }
    }, [])

    const networkOnChange = function(event) {
        event.preventDefault();
        setNetworks(event.target.value);
        localStorage.setItem("selectedNetworks",event.target.value);
        navigate(`/`);
    }

    const searchOnChange = async function(event) {
        event.preventDefault();
        let searchText = search
        if(network === "Mainnet") {
            const response = await fetch(`https://gateway.warp.cc/gateway/search/${searchText}`);
            const result = await response.json();
            if(result[0].type === "contract"){
                setSearch('')
                navigate(`/contract/${searchText}`)
            }else if(result[0].type === "interaction") {
                setSearch('')
                const tags = result[0].interaction.tags
                //console.log(tags,'tags')
                const contract_id = tags.filter(t => {return t.name === 'Contract'})
                //console.log(contract_id,'contract_id')
                navigate(`/contract/${contract_id[0].value}/${searchText}`)
            }
        }else if(network === "Testnet"){
            try{
                const response = await fetch(`https://gateway.warp.cc/gateway/contract?txId=${searchText}`);
                const result = await response.json();
                setSearch('')
                navigate(`/contract/${searchText}`)
            }catch(e){
                const response = await fetch(`https://gateway.warp.cc/gateway/interactions/${searchText}`);
                const result = await response.json();
                setSearch('')
                navigate(`/contract/${result.contractid}/${searchText}`)
            }
        }
    }

    return (
        <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">WrapStepper</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarScroll">
                    <form className='navbar-form col-lg-10' role="search" onSubmit={searchOnChange}>
                        <input className="form-control me-2 my-2" type="search" placeholder="Search" aria-label="Search"
                        onChange={event => setSearch(event.target.value)}
                        value={search}/>
                    </form>
                    <select className="form-select form-select mx-2"
                    value={network}
                    onChange={networkOnChange}>
                        <option value="Mainnet">Mainnet</option>
                        <option value="Testnet">Testnet</option>
                    </select>

                </div>
            </div>
        </nav>
    );
};

export default Header;
