import React,{useEffect,useState} from "react";
import HeatMap from "@uiw/react-heat-map";

//function to generate dummy data->generate random activity

const generateActivityData=(startDate,endDate)=>{
    const data=[];
    let currentData=new Date(startDate);
    console.log(currentData);
    const end=new Date(endDate);
while(currentData<=end){
    // const count=Math.floor(Math.random()*50); //0-50 count
    let count;

const random = Math.random();

if (random < 0.35) {
    count = 0;
}
else if (random < 0.70) {
    count = Math.floor(Math.random() * 5) + 1;   // light green
}
else if (random < 0.90) {
    count = Math.floor(Math.random() * 10) + 6;  // medium
}
else {
    count = Math.floor(Math.random() * 15) + 16; // dark (rare)
}


    data.push({
       date:currentData.toISOString().split('T')[0],  //date
        count:count,
        })
        currentData.setDate(currentData.getDate()+1);
}
return data;
};
// const getPanelColors=(maxCount)=>{
//     const colors={}; //maxcount->how many shades we want
//     for( let i=0;i<=maxCount;i++){
//         const currGreenVal= Math.floor((i/maxCount)*255); 
//         colors[i]=`rgb(0 ,${currGreenVal} ,0)`; //green shades
//     }
//     return colors;
// };
// const getPanelColors = (maxCount) => {
//   const colors = {};

//   for (let i = 0; i <= maxCount; i++) {

//     if (i === 0) {
//       colors[i] = "#ebedf0";       // empty cell (Github light)
//     } else {

//       const intensity = Math.floor((i / maxCount) * 180) + 50;

//       colors[i] = `rgb(0, ${intensity}, 0)`;
//     }
//   }

//   return colors;
// };
const getPanelColors = (maxCount) => {

    const colors = {};

    for (let i = 0; i <= maxCount; i++) {

        if (i === 0) {
            colors[i] =  "#30a14e";
        }
        else if (i <= maxCount * 0.25) {
            colors[i] = "#9be9a8";
        }
        else if (i <= maxCount * 0.5) {
            colors[i] = "#40c463";
        }
        else if (i <= maxCount * 0.75) {
            colors[i] = "#ebedf0";
        }
        else {
            colors[i] = "#216e39";
        }

    }

    return colors;
};


const HeatMapProfile=()=>{
const [activityData,setActivityData]=useState([]);
const [panelColors,setPanelColors]=useState({}); //set h thats why curly bracket clr shade not repeat

useEffect(()=>{
    const fetchData=async()=>{
        const startDate='2025-01-01';
        const endDate='2025-12-31';
        const data=generateActivityData(startDate,endDate);
        setActivityData(data);
        const maxCount=Math.max(...data.map((d)=>d.count)); ///no of shades
        setPanelColors(getPanelColors(maxCount));
    }
fetchData();
},[]);



//frontend
return(
    <div className="heatmap-container">
        <h4 className="section-title">Recent Contributions</h4>

        <div className="contribution-card">
    <h3 className="contribution-title"> 365 Contributions in 2025</h3>

    

       <HeatMap
       className="heatmap-scroll"
style={{
    width:"100%",
}}
        value={activityData}
        weekLabels={['Sun','Mon','Tue','Wed','Thu','Fri','Sat']}
        monthLabels={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",]}
        startDate={new Date("2025-01-01")}
          endDate={new Date("2025-12-31")}
        rectSize={22} //15
        space={5} //3
        rectProps={{
            rx:2.5,   // 2.5 horizontal size of colors
        }}
        panelColors={panelColors}
        >
          
       </HeatMap>

       </div>
    </div>
)

}


export default HeatMapProfile;




