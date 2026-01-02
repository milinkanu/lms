import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

import { ThemeContext } from '../../context/ThemeContext'

const Navbar = () => {

    const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext)
    const { theme, toggleTheme } = useContext(ThemeContext)

    const isCourseListPage = location.pathname.includes('/course-list')

    const { openSignIn } = useClerk()
    const { user } = useUser()

    const becomeEducator = async () => {
        try {
            if (isEducator) {
                navigate('/educator')
                return;
            }
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/educator/update-role-to-educator', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.status === 'success') {
                setIsEducator(true)
                toast.success(data.message)
                navigate('/educator')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'} dark:bg-slate-900 dark:border-gray-700`}>
            <img onClick={() => navigate('/')} src={theme === 'dark' ? assets.logo_dark : assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' />
            <div className='hidden md:flex items-center gap-5 text-gray-500 dark:text-gray-300'>
                <div className='flex items-center gap-5'>
                    <button onClick={toggleTheme} className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors'>
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    {user && <>
                        <button onClick={becomeEducator}>{isEducator ? "Educator Dashboard" : "Become Educator"}</button>|
                        <Link to='/my-enrollments'>My Enrollments</Link>
                    </>

                    }
                </div>
                {user ? <UserButton /> :

                    <button onClick={() => openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full'>Create Account</button>}
            </div>
            {/* For Phone Screen */}
            <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500 dark:text-gray-300'>
                <div className='flex items-center gap-1 sm:gap-2 sm:text-xs max-sm:text-xs'>
                    <button onClick={toggleTheme} className='p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors mr-2'>
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    {user && <>
                        <button onClick={becomeEducator}>{isEducator ? "Educator Dashboard" : "Become Educator"}</button>|
                        <Link to='/my-enrollments'>My Enrollments</Link>
                    </>
                    }
                </div>
                {
                    user ? <UserButton /> : <button onClick={() => openSignIn()}><img src={assets.user_icon} alt="" /></button>
                }

            </div>
        </div>
    )
}

export default Navbar