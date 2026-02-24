// Save data to localStorage
function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  // Get data from localStorage
  function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  
  // Remove data from localStorage
  function removeData(key) {
    localStorage.removeItem(key);
  }
  