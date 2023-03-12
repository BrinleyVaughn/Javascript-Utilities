import { useEffect, useRef, useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, useForm } from '@inertiajs/react';

import {
    Accordion,
    AccordionBody,
  } from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon, MagnifyingGlassIcon  } from '@heroicons/react/24/solid';
import { getUrlParams, hasActiveFilter } from '@/utils';
import NavLinkDropDown from '@/Components/NavLinkDropDown';

export default function Authenticated({ 
    // auth, 
    header, children, successMessage, errorMessage, actions, filters, defaultColumns, displayedColumns, allColumns, setDisplayedColumns, columnsCollection, basePath}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [thisDisplayedColumns, setThisDisplayedColumns] = useState([]);
    const {get, errors, data, setData} = useForm({...getUrlParams()});

    const filterInputs = useRef([]);

    const auth = {
        user: {
            name: "Brinley"
        }
    }

    useEffect( () => {
        setThisDisplayedColumns(displayedColumns);
    }, [displayedColumns])

    const updateColumns = (e) => {
        let d = [...displayedColumns];
        
        const current = e.target.value;
        
        if(!e.target.checked) {
            const i = d.indexOf(current);
            d.splice(i, 1);
        }
        else if(!d.includes(current)) {
            if(  d.length > 1 ) {
                const i = allColumns.indexOf(current);
                
                let valBefore = 0;

                for(let x = i-1; x > 0; x--) {
                    if(d.includes(allColumns[x]) ) {
                        valBefore = allColumns[x];
                        break;
                    }
                }

                const indexBefore = d.indexOf(valBefore);
                d.splice(indexBefore+1, 0, current);
            }
            else {
                d.push(current);
            }
        }

        updateLocalStorageColumns(d);
        
        return d;
    }

    const updateLocalStorageColumns = (vals) => {
        if(columnsCollection) {
            
            if(localStorage.getItem("columnsOrder") && localStorage.getItem("columnsOrder").length ) {
                let colsObj = JSON.parse(localStorage.getItem("columnsOrder"));
                colsObj[columnsCollection] = vals;
                localStorage.setItem("columnsOrder", JSON.stringify(colsObj))
            }
            else {
                let userColumns = {};
                userColumns[columnsCollection] = vals;
                localStorage.setItem("columnsOrder", JSON.stringify(userColumns));
            }
        }
    }

    const stripUrlParams = () => {
        const fullUrl = window.location.href;
        const basePath = fullUrl.split("?")[0];
        return basePath;
    }

    const submitFilters = () => {
        get(`/${basePath}`);
    }

    const clearFilters = () => {
        filterInputs.current.forEach( (inp, i) => {
            // console.log(inp.defaultValue);
            if(inp.type === "select-one"){
                inp.selectedIndex = 0;
            }
            else {
                inp.value = '';
            }
        })
        setData({})
    }
    
    const filterClasses = "text-sm text-gray-600 placeholder:text-gray-600 px-3 py-2 border  rounded-sm border-gray-200 focus:border focus:border-gray-400 focus-within:border focus-within:border-gray-400 focus-visible:border focus-visible:border-gray-400 outline-none mx-1 my-3";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>


                            <NavLinkDropDown label="Products" active={route().current('products.index')}  links={[
                                {
                                    label: "View All",
                                    url: route('products.index')
                                },
                                {
                                    label: "Import",
                                    url: route('products.import')
                                },
                                {
                                    label: "Prep Web QA Info",
                                    url: route('products.index')
                                },
                            ]} />
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                {auth.user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex">
                        <div className="w-1/3">
                            {header}
                        </div>

                        <div className="w-1/3 text-center">
                            {
                                successMessage && successMessage.length ? <span className="alert alert-success text-green-500">{successMessage}</span> : ""
                            }
                        </div>

                        <div className="w-1/3 flex justify-end align-center">
                            {
                                filters && filters.length &&
                                    <button className="btn btn-filters text-sm bg-blue-200 hover:bg-blue-300 px-2 py-1 flex justify-center align-center" onClick={(() => {setFiltersOpen( !filtersOpen)})}>
                                        <span>FILTERS</span>
                                        <span className="flex justify-center align-center h-full">
                                        {
                                            filtersOpen ?
                                            <EyeSlashIcon className="h-5 w-4 ml-2 inline" />
                                            : <EyeIcon className="h-5 w-4 ml-2 inline" />

                                        }
                                        </span>
                                    </button>
                            }
                            
                            {
                                actions && actions.length ?
                                actions.map( (action, pos) => (
                                    action.isLink ? <Link key={`action-${pos}`} href={action.url || "#"} className={`px-2 py-1 ml-5 text-sm btn flex justify-center align-center ${action.classes || ""}`} onClick={action.onClick} >{action.label || ""}</Link> :
                                    <button key={`action-${pos}`} className={`px-2 py-1 ml-5 text-sm btn flex justify-center align-center ${action.classes || ""}`} onClick={action.onClick} >{action.label || ""}</button>
                                ))
                                : ""
                            }
                        </div>
                        
                    </div>

                    {
                        (filters && filters.length) || (allColumns && allColumns.length) ? 
                            <Accordion open={filtersOpen } >
                                <AccordionBody className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
                                    {   filters && filters.length &&
                                    <div className="flex flex-wrap justify-between filters-row">
                                        {filters.map( (filter, fPos) => {
                                            if(filter.type="select" && filter.options && filter.options.length) {
                                                return <select key={`filter-${fPos}`} className={`${filterClasses} ${hasActiveFilter(filter.name) ? " border-green-500 border-2" : ""} pr-11`} defaultValue={filter.defaultValue}
                                                name={filter.name}
                                                ref={el => filterInputs.current[fPos] = el} 
                                                onChange={(e) => {
                                                    setData(filter.name, e.target.value)
                                                }}
                                                >
                                                    {
                                                        filter.placeholder && <option value="">{filter.placeholder}</option>
                                                    }
                                                    {
                                                        filter.options.map((option, foPos) => {
                                                            return <option key={`filter-${fPos}-option-${foPos}`} value={option.value}>{option.label}</option>
                                                        })
                                                    }
                                                </select>
                                            }
                                            else {
                                                return <input key={`filter-${fPos}`} type={filter.type} defaultValue={filter.defaultValue} placeholder={filter.placeholder} name={filter.name} className={`${filterClasses} ${hasActiveFilter(filter.name) ? " border-green-500 border-2" : ""}`}
                                                ref={el => filterInputs.current[fPos] = el} 
                                                onChange={(e) => {
                                                    setData(filter.name, e.target.value)
                                                }}
                                                />
                                            }
                                        })}
                                        
                                            <button  className="text-sm text-white px-3 py-2 border focus:border mx-1 my-3 bg-sky-600 hover:bg-sky-700 flex align-center justify-center"
                                            onClick={submitFilters}>
                                                <MagnifyingGlassIcon className="h-5 w-4 text-white"/>
                                            </button>
                                        
                                    </div>
                                    }
                                    {
                                        allColumns && allColumns.length &&
                                        <div className="columns-to-display mt-6">
                                            <p className="text-lg font-bold text-gray:700 mb-4">Columns to Display</p>
                                            {
                                                allColumns.map( (col, pos) => {
                                                    return <div className="checkrow inline-block mr-5 mb-3" key={`col-select-${pos}`}>
                                                        <input id={`col-check-${col}`} type="checkbox" value={col} checked={thisDisplayedColumns.includes(col)} className="inline-block mr-2" onChange={(e) => {
                                                            setDisplayedColumns(updateColumns(e));
                                                        }} />
                                                        <label htmlFor={`col-check-${col}`} className="inline-block mr-2">{col}</label>
                                                    </div>
                                                })
                                            }
                                            
                                        </div>
                                        
                                    }

                                    {
                                        (filters && filters.length) || (allColumns && allColumns.length) ? 
                                            <div className="flex align-center justify-center mt-6">
                                                {
                                                    allColumns && allColumns.length &&
                                                    <button className={`bg-blue-700 text-white px-2 py-1 mt-5 text-sm btn flex justify-center align-center mx-2`} onClick={ () => {
                                                        updateLocalStorageColumns(defaultColumns);
                                                        setDisplayedColumns(defaultColumns);
                                                    }} >RESET COLUMNS</button>
                                                }

                                                {
                                                    filters && filters.length &&
                                                    <Link preserveState href={stripUrlParams()} className={`bg-purple-700 text-white px-2 py-1 mt-5 text-sm btn flex justify-center align-center mx-2`} 
                                                    onClick={ (e) => {  clearFilters();  }}
                                                    >RESET FILTERS</Link>
                                                }
                                                {
                                                    filters && filters.length && allColumns && allColumns.length &&
                                                    <Link preserveState href={stripUrlParams()} className={`bg-orange-700 text-white px-2 py-1 mt-5 text-sm btn flex justify-center align-center mx-2`} onClick={ (e) => {
                                                        
                                                        clearFilters();
                                                        updateLocalStorageColumns(defaultColumns);
                                                        setDisplayedColumns(defaultColumns);
                                                    }} >RESET ALL</Link>
                                                }
                                                
                                            </div> : ""
                                    }
                                </AccordionBody>
                            </Accordion> : ""
                    }
                </header>
                
            )}

            <main>{children}</main>
        </div>
    );
}
