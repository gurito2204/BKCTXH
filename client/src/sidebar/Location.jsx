import React from 'react'
import InputField from '../components/InputField'

const Location = ({handleChange}) => {
  return (
    <div>
    <h4 className="text-lg font-medium mb-2">Cơ sở</h4>
    <div>
        <label className="sidebar-label-container">
            <input type="radio" name="test" id="test" value="" onChange={handleChange} />
            <span className="checkmark"></span>Tất cả
        </label>
        <InputField handleChange={handleChange} value="Cơ sở 1" title="Cơ sở 1" name="test"/>
        <InputField handleChange={handleChange} value="Cơ sở 2" title="Cơ sở 2" name="test"/>
        <InputField handleChange={handleChange} value="Khác" title="Khác" name="test"/>
    </div>
</div>
  )
}

export default Location