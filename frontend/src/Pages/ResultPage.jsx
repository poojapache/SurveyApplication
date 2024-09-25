import React from 'react'
import { useLocation } from 'react-router-dom';
import { PieChart, pieArcLabelClasses} from '@mui/x-charts/PieChart';
import NoData from '../Components/NoData';



export default function ResultPage()
{
    const location = useLocation();
    const {responseData} = location.state || {};
    const pieDiag = 
    <PieChart
      series={[
          {
            arcLabel: (item) => `${item.label} (${item.value})`,
            arcLabelMinAngle: 45,
            data: responseData,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}

      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontWeight: 'bold',
        },
      }}
      
      width={900}
      height={450}
/>

    return(
      <div className='w-100 d-flex justify-content-center align-items-center vh-100 flex-column pt-5'>
        <h1 className='w-100'>Results for this year</h1>
        {!(isNaN(responseData[0].value) && isNaN(responseData[1].value))?pieDiag:<div className="w-100 vh-100 p-5"><NoData/></div>}
      </div>
        );
}