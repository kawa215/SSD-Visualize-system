import SelectionData from "./component/SelectionData.js";
import NavBar from "./component/NavBar.js";
import CompareView from "./component/CompareView.js";
import styles from "./App.module.css";
import FactorMapMode from "./component/FactorMapMode.js";
import DetectionMode from "./component/DetectionMode.js";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import FactorMapMode from "./component/FactorMapMode.js";

function App() {
  return (
    <div className={styles.App}>
      <NavBar></NavBar>
      <SelectionData></SelectionData>
      <Tabs forceRenderTabPanel={true} className={styles.Tabs}>
        <TabList className={[styles.margin, styles.border].join(" ")}>
          <Tab>DetectionResultMode</Tab>
          <Tab>FactorMapMode</Tab>
        </TabList>
        <TabPanel>
          <DetectionMode></DetectionMode>
        </TabPanel>
        <TabPanel>
          <FactorMapMode></FactorMapMode>
        </TabPanel>
      </Tabs>
      <CompareView></CompareView>
      {/* <SelectionData></SelectionData> */}
    </div>
  );
}

export default App;
