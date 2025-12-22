import React from 'react';
import Button from './Button'; // Corrected path
import InputField from '../components/InputField'; // Corrected path

const Salary = ({ handleChange, handleClick }) => {
  return (
    <div>
        <h4 className='text-lg font-medium mb-2'>Salary</h4>
        <div className='mb-4'>
            <Button onClickHandler={handleClick} value="Hourly" title="Hourly"/>
            <Button onClickHandler={handleClick} value="Monthly" title="Monthly"/>
            <Button onClickHandler={handleClick} value="Yearly" title="Yearly"/>
        </div>

        <div>
            <label className='sidebar-label-container'>
                <input
                    type="radio"
                    name="test2" // Changed name to avoid conflict with other radio groups
                    value=""
                    onChange={handleChange}
                />
                <span className="checkmark"></span>All
            </label>

            <InputField handleChange={handleChange} value={30} title="< 30k" name="test2" />
            <InputField handleChange={handleChange} value={50} title="< 50k" name="test2" />
            <InputField handleChange={handleChange} value={80} title="< 80k" name="test2" />
            <InputField handleChange={handleChange} value={100} title="< 100k" name="test2" />
        </div>
    </div>
  )
}

export default Salary;
