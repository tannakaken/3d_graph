import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ThreeDChart from './ThreeDChart';
import { PieChart } from './PieChart';

function App() {
  return (
    <div>
      <h1>3D円グラフやめろ！</h1>
      <Tabs>
        <TabList>
          <Tab>Pie Chart</Tab>
          <Tab>Pie Chart</Tab>
        </TabList>
  
        <TabPanel>
          <ThreeDChart>
            <PieChart />
          </ThreeDChart>
        </TabPanel>
        <TabPanel>
          <ThreeDChart>
            <PieChart />
          </ThreeDChart>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default App;
