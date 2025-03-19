import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserSearchCard = ({ user, onClose }) => {
    return (
        <Link
            to={"/" + user?._id}
            onClick={onClose}
            className='flex items-center gap-4 p-3 lg:p-4 border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:border-primary transition duration-300 cursor-pointer bg-white hover:bg-slate-50'
        >
            <div className='flex-shrink-0'>
                <Avatar
                    width={48}
                    height={48}
                    name={user?.name}
                    userId={user?._id}
                    imageUrl={user?.profile_pic}
                    className="rounded-full border border-slate-300"
                />
            </div>
            <div className='w-full'>
                <div className='font-semibold text-gray-800 text-base truncate'>
                    {user?.name}
                </div>
                <p className='text-sm text-gray-500 truncate'>
                    {user?.email}
                </p>
            </div>
        </Link>
    )
}

export default UserSearchCard
