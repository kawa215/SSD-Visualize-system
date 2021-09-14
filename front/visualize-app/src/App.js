import SelectionData from './component/SelectionData.js'
import NavBar from './component/NavBar.js'
import DataView from './component/DataView.js'
import CompareView from './component/CompareView.js'
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.App}>
      <NavBar></NavBar>
      <SelectionData></SelectionData>
      <DataView></DataView>
      <CompareView></CompareView>
      {/* <SelectionData></SelectionData> */}
    </div>
  );
}

export default App;
