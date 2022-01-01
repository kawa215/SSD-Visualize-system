import SelectionData from "./component/SelectionData.js";
import NavBar from "./component/NavBar.js";
import CompareView from "./component/CompareView.js";
import styles from "./App.module.css";
import FactorMapMode from "./component/FactorMapMode.js";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
// import FactorMapMode from "./component/FactorMapMode.js";

function App() {
  return (
    <div className={styles.App}>
      <NavBar></NavBar>
      <SelectionData></SelectionData>
      <Tabs className={styles.Tabs}>
        <TabList  className={[styles.margin, styles.border].join(" ")}>
          <Tab >FactorMapMode</Tab>
          <Tab>DetectionResultMode</Tab>
        </TabList>
        <TabPanel >
         <FactorMapMode></FactorMapMode>
        </TabPanel>
        <TabPanel>test</TabPanel>
      </Tabs>
      <CompareView></CompareView>
      {/* <SelectionData></SelectionData> */}
    </div>
  );
}

export default App;
