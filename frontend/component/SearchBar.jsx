import React from 'react';
import search_icon from '../src/assets/search_icon.png'

const SearchBar = ( { search, setSearch, placeholder = "Search" }) => {

    
    return (
       <div className=" fixed sm:top-0 sm:pr-[200px] w-full   border-b bg-gray-50  text-center">
                <div className="inline-flex sm:my-8 w-[75%]  items-center justify-center border border-gray-400 px-10 my-5 rounded-full sm:w-1/2">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 outline-none bg-inherit text-sm py-1 sm:py-1" type="text" placeholder={placeholder} />
                    <img className=" w-4" src={search_icon} alt="" />
                </div>
         </div>
    );
};

export default SearchBar;