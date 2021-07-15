import SelectionData from './component/SelectionData.js'
import NavBar from './component/NavBar.js'
import DataView from './component/DataView.js'
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.App}>
      <NavBar></NavBar>
      <SelectionData></SelectionData>
      <DataView></DataView>
      {/* <SelectionData></SelectionData> */}
    </div>
  );
}

export default App;
