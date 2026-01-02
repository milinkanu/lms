import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
const Dashboard = () => {

  const { currency, backendUrl, getToken, isEducator } = useContext(AppContext)
  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`${backendUrl}/api/educator/get-educator-dashboard-data`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (data.status === 'success') {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData()
    }
  }, [isEducator])
  return dashboardData ? (
    <div className="min-h-screen flex items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className='space-y-5'>
        <div className='flex flex-wrap gap-5 items-center'>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md dark:bg-slate-800 dark:border-blue-500">
            <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
              <img className="w-6" src={assets.patients_icon} alt="patients_icon" />
            </div>
            <div>
              <p className="text-2xl font-medium text-gray-600 dark:text-gray-200">
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400">Total Enrollments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md dark:bg-slate-800 dark:border-blue-500">
            <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
              <img className="w-6" src={assets.my_course_icon} alt="my_course_icon" />
            </div>
            <div>
              <p className="text-2xl font-medium text-gray-600 dark:text-gray-200">
                {dashboardData.totalCourses}
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400">Total Courses</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md dark:bg-slate-800 dark:border-blue-500">
            <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
              <img className="w-6" src={assets.earning_icon} alt="earning_icon" />
            </div>
            <div>
              <p className="text-2xl font-medium text-gray-600 dark:text-gray-200">{currency}{dashboardData.totalEarnings}</p>
              <p className="text-base text-gray-500 dark:text-gray-400">Total Earnings</p>
            </div>
          </div>
        </div>
        <div className="pt-16">
          <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
          <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20 dark:bg-slate-800 dark:border-gray-700'>
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left dark:text-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-500 dark:text-gray-300">
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-500/20 dark:border-gray-700">
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {index + 1}
                    </td>
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      <img
                        src={item.student.imageUrl}
                        alt="student"
                        className="w-9 h-9 rounded-full"
                      />
                      <span className="truncate">{item.student.name}</span>
                    </td>
                    <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default Dashboard