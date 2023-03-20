import React from 'react';
const SearchBox = ({ value, onChange }) => {
  return (
    <div className="search-box">
      <input
        className="search-input"
        type="text"
        placeholder="Search channels"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default React.memo(SearchBox);
