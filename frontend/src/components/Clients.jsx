import Avatar from 'react-avatar';

const Clients = ({ username }) => {
    return (
        <div className="flex flex-col basis-1/3 justify-center items-center ">
            {/* Username Avatar */}
            <Avatar name={username} maxInitials={2} round="12px" size={50} className="cursor-pointer" />
            <p className="mb-6 mt-2 line-clamp-1 text-sm font-bold">
                {username}
            </p>
        </div>
    )
}

export default Clients