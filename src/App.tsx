import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ThreeDChart from './ThreeDChart';
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { Prompt } from './Prompt';

function App() {
  return (
    <div>
      <h1>または私は如何にして心配するのを止めて3Dの円グラフを愛するようになったか</h1>
      <Tabs>
        <TabList>
          <Tab>Pie Chart</Tab>
          <Tab>Bar Chart</Tab>
          <Tab>Line Chart</Tab>
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
        <TabPanel>
          <ThreeDChart>
            <LineChart />
          </ThreeDChart>
        </TabPanel>
      </Tabs>
      <Prompt.Root />
    </div>
  );
}

export default App;
