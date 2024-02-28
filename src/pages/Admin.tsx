import { useEffect, useState } from 'react';
import { useChain } from '@cosmos-kit/react';
import { CHAIN_NAME, STAKING_CONTRACT } from '@/app/utils/constants';
import { useWalletStore } from '@/hooks';
import { formatEther, parseEther } from 'viem';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import axios, { isCancel, AxiosError } from 'axios';
import { Select, Option } from "@material-tailwind/react";
import React from "react";
import Form from 'react-bootstrap/Form';

import 'react-toastify/dist/ReactToastify.css';
// import { Button, Form, Select } from "react-bootstrap";
/* import the ListBox dependency styles */

import { mkConfig, generateCsv, download } from "export-to-csv";



const Admin = () => {
  
  const { queryContract, executeContract } = useWalletStore();
  const { address } = useChain(CHAIN_NAME);
  const [newOwner, setNewOwner] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardCycle, setRewardCycle] = useState('');
  const [spots, setSpots] = useState('');
  const [fee, setFee] = useState('');
  const [withdrawFeeAmount, setWithdrawFeeAmount] = useState('');
  const [collectionAddressToRemove, setCollectionAddressToRemove] =
    useState('');
  const unstakeFee = useSelector((state: any) => state.staking.unstakeFee);
  const [feeCollected, setFeeCollected] = useState('0');
  const [resData, setResData] = useState([]);
  const [selectedOption, setSelectedOption] = useState<String>();
 
  const csvConfig = mkConfig({ useKeysAsHeaders: true });
  const txtConfig = mkConfig({
    useKeysAsHeaders: true,
    useTextFile: true,
  });


  const Fetch_Data = async () => {
    let res = await axios.post('http://127.0.0.1:3000/api/allCollections_token', {
        command_: 'All Fetch'
      })
      List_sort(res.data);
  }

  let list_data:any;

  const List_sort = (res_data:any) =>{

    list_data = [];

    res_data.map((item: any, index: number) => {

      if (typeof list_data[item.contract] === 'undefined'){
        list_data[item.contract] = [];
      }else
      {
        const ind = list_data[item.contract].findIndex((el: any) => {
          if (el.token_id == item.token_id && el.owner == item.owner) {
            return true
          }
        })
        if (ind == -1) {
          list_data[item.contract].push({
            token_id: item.token_id,
            owner: item.owner
          })
        } else {
          list_data[item.contract][ind].token_id = item.token_id;
          list_data[item.contract][ind].owner = item.owner;
        }       
      }
      });
      
      setResData(list_data);
   
  }
  
   // This function is triggered when the select changes
   const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
  };

  const onDownloadCSV = () => {
   
    if(selectedOption){
      console.log("download:",resData[selectedOption]);
      // debugger
      const csv = generateCsv(csvConfig)(resData[selectedOption]);
      download(csvConfig)(csv)
    }else{
      toast("Select Contract");
    }
      
  }

  const showList = () =>{
    let tables: any;
    if (!resData) {      
      tables = (        
        <option >No Data Found</option>        
     );
    } else {
         {   
          tables = (   
            Object.keys(resData).map((key: any) => (
              <option value={key} key={key}  style={{backgroundColor:'black'}} > {resData[key].length} : {key} </option>
            ))
          );
        }
    }
    return (
      
      <div style={styles.container}>
            
            <Form.Select  onChange={selectChange} style={styles.select} aria-label="Default select example" >
              {tables}
            </Form.Select>
            {selectedOption && <h2  style={{margin: '5%',height: '70%', position: 'absolute', left: '0px', width: '80%', overflow: 'scroll'}}>
              {showTables(selectedOption)}</h2>}
      </div>
        );
  }

  const showTables = (value: any) => {
 
    let tables: any;
    let count : number;
    count = 1;
    tables = (

      <table className="min-w-full text-center" >
        <thead className="border-b bg-gray-50">
          <tr className='border-2'>
            <th className="px-6 py-4 text-sm font-medium text-gray-900"></th>
            <th className="px-6 py-4 text-sm font-medium text-gray-900">Token ID</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-900">Owner</th>
            {/* <th>Contract</th> */}
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(resData[value]).map((key: any) => (
              <tr key={key} className='border-b" text-center'>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white" >{count++}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">{resData[value][key]['token_id']}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">{resData[value][key]['owner']}</td>
                {/* <td>{value}</td> */}
              </tr>
            ))
          }  
        </tbody>
      </table>     
    );
    
    return tables;
  }
  
  useEffect(() => {
    
    void (async () => {
      Fetch_Data();  
      const response = await queryContract(STAKING_CONTRACT, {
        get_config: {},
      });
      setFeeCollected(response.fee_collected);
    })();
  }, []);

  
   // Configs



   
    

  return (
    <div className='w-[calc(100%_-_80px)] mx-10 flex flex-col '>
      
      {address ? (
        <div className='flex flex-col gap-20'>
          <div className='flex flex-col w-full gap-4'>
                { showList()}
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full gap-4'>
              <input
                type='text'
                placeholder='Collection Address'
                className='bg-transparent border rounded-lg'
                value={depositAddress}
                onChange={(e) => setDepositAddress(e.target.value)}
              />
              <input
                type='text'
                placeholder='Amount in $INJ'
                className='bg-transparent border rounded-lg'
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                await executeContract(
                  STAKING_CONTRACT,
                  {
                    deposit_collection_reward: {
                      address: depositAddress,
                    },
                  },
                  {
                    denom: 'inj',
                    amount: parseEther(depositAmount).toString(),
                  }
                );
              }}
            >
              Deposit Collection Reward
            </button>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full gap-4'>
              <input
                type='text'
                placeholder='New Owner'
                className='bg-transparent border rounded-lg'
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
              />
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                await executeContract(STAKING_CONTRACT, {
                  transfer_ownership: {
                    address: newOwner,
                  },
                });
              }}
            >
              Transfer Ownership
            </button>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full'>
              <div className='flex flex-col w-full gap-4'>
                Current fee: {formatEther(unstakeFee.amount ?? '0')} $INJ
              </div>
              <div className='flex flex-col w-full gap-4'>
                <input
                  type='text'
                  placeholder='Unstake Fee amount in $INJ'
                  className='bg-transparent border rounded-lg'
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                await executeContract(STAKING_CONTRACT, {
                  change_fee: {
                    fee: {
                      denom: 'inj',
                      amount: parseEther(fee).toString(),
                    },
                  },
                });
              }}
            >
              Change Unstake Fee
            </button>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full'>
              <div className='flex flex-col w-full gap-4'>
                Fee collected: {formatEther(feeCollected ?? '0')} $INJ
              </div>
              <div className='flex flex-col w-full gap-4'>
                <input
                  type='text'
                  placeholder='Withdraw Fee amount in $INJ'
                  className='bg-transparent border rounded-lg'
                  value={withdrawFeeAmount}
                  onChange={(e) => setWithdrawFeeAmount(e.target.value)}
                />
              </div>
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                await executeContract(STAKING_CONTRACT, {
                  withdraw_fee: {
                    fee: {
                      denom: 'inj',
                      amount: parseEther(withdrawFeeAmount).toString(),
                    },
                  },
                });
              }}
            >
              Withdraw Fee
            </button>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full gap-4'>
              <input
                type='text'
                placeholder='Collection Address'
                className='bg-transparent border rounded-lg'
                value={collectionAddress}
                onChange={(e) => setCollectionAddress(e.target.value)}
              />
              <input
                type='number'
                placeholder='Reward amount in $INJ'
                className='bg-transparent border rounded-lg'
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
              />
              <input
                type='number'
                placeholder='Reward cycle in seconds'
                className='bg-transparent border rounded-lg'
                value={rewardCycle}
                onChange={(e) => setRewardCycle(e.target.value)}
              />
              <input
                type='text'
                placeholder='Available spots'
                className='bg-transparent border rounded-lg'
                value={spots}
                onChange={(e) => setSpots(e.target.value)}
              />
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                await executeContract(STAKING_CONTRACT, {
                  whitelist_collection: {
                    address: collectionAddress,
                    reward: {
                      denom: 'inj',
                      amount: parseEther(rewardAmount).toString(),
                    },
                    cycle: parseInt(rewardCycle),
                    is_whitelisted: true,
                    spots: parseInt(spots),
                  },
                });
              }}
            >
              Add Collection
            </button>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col w-full gap-4'>
              <input
                type='text'
                placeholder='Collection Address'
                className='bg-transparent border rounded-lg'
                value={collectionAddressToRemove}
                onChange={(e) => setCollectionAddressToRemove(e.target.value)}
              />
            </div>
            <button
              className='bg-button-normal btn-hover w-full rounded-lg hover:rounded-lg'
              onClick={async () => {
                const collections = await queryContract(STAKING_CONTRACT, {
                  get_collections: {},
                });
                const collection = collections.find(
                  (c) => c.address == collectionAddressToRemove
                );
                if (collection) {
                  await executeContract(STAKING_CONTRACT, {
                    whitelist_collection: {
                      ...collection,
                      is_whitelisted: false,
                    },
                  });
                } else {
                  toast.error('Collection not found');
                }
              }}
            >
              Remove Collection
            </button>
          </div>
        </div>
      ) : (
        /////////table////////////////////////
        <div>
            {/* <div className='w-full text-center mt-20'>Connect Wallet</div> */}
            <div>
             <button mt-9 w-fit border bg-button-normal btn-hover rounded px-7 py-3 font-medium leading-none font-gotham-black  id="csv" onClick={onDownloadCSV} >
                <a class="mt-9 w-fit border border-[#FFFFFF1A] bg-button-normal btn-hover rounded px-7 py-3 text-[18px] font-medium leading-none font-gotham-black">Download as CSV</a>
              
              </button>
            </div>
            <div>
          
                { showList()}
            </div>
            
        </div>
        
        ///////////////////////////////
      )}
    </div>
  );
};

export default Admin;

  

// Just some styles
const styles: { [name: string]: React.CSSProperties } = {
  container: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  select: {
    padding: 5,
    width: 500,
    'background-color': 'transparent',
  },
  option:{
    // 'background-color' : 'gray',
  },
  result: {
    marginTop: 30,

  },
};