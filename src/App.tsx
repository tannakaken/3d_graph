import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ThreeDChart from './ThreeDChart';
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { Prompt } from './Prompt';
import { RadarChart } from './RadarChart';
import { ThreeDNovel } from './ThreeDNovel';
import { novelEn, novelJa } from './novel';

function App() {
  return (
    <div>
      <h1>Dr. Strangegraph</h1>
      <Tabs>
        <TabList>
          <Tab>Pie Chart</Tab>
          <Tab>Bar Chart</Tab>
          <Tab>Line Chart</Tab>
          <Tab>Radar Chart</Tab>
          <Tab>Or: How I Learned...</Tab>
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
        <TabPanel>
          <ThreeDChart>
            <RadarChart />
          </ThreeDChart>
        </TabPanel>
        <TabPanel>
          <ThreeDChart>
            <ThreeDNovel text={window.navigator.language === "ja" ? novelJa : novelEn} fontSize={0.25} />
          </ThreeDChart>  
        </TabPanel>
      </Tabs>
      <Prompt.Root />
    </div>
  );
}

export default App;
