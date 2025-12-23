import React from 'react'

const Jobs = ({result}) => {
  return (
    <>
    <div className="">
      <h3 className="text-lg font-bold mb-2">{result.length} hoạt động</h3>
    </div>
    <section className="">{result}</section>
    </>
  )
}

export default Jobs