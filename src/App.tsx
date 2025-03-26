import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ThreeDChart from './ThreeDChart';
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';

function App() {
  return (
    <div>
      <h1>3D円グラフやめろ！</h1>
      <Tabs>
        <TabList>
          <Tab>Pie Chart</Tab>
          <Tab>Bar Chart</Tab>
        </TabList>
  
        <TabPanel>
          <ThreeDChart>
            <PieChart />
          </ThreeDChart>
        </TabPanel>
        <TabPanel>
          <ThreeDChart>
            <BarChart />
          </ThreeDChart>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default App;
