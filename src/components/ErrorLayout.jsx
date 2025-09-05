import PropTypes from 'prop-types';

function ErrorLayout({errMsg = 'Something went wrong', handleRefresh = () => { }}) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-200/50 z-50">
        <div className="flex flex-col items-center">
            <p className="mt-4 text-black text-lg md:text-xl font-[700]">{errMsg}</p>
            <button
                className='bg-priColor rounded-md text-white px-8 py-3 mt-8 text-lg'
                onClick={handleRefresh}
            >
                Retry
            </button>
        </div>
    </div>
  )
}

ErrorLayout.propTypes = {
  errMsg: PropTypes.string,
  handleRefresh: PropTypes.func,
};

export default ErrorLayout