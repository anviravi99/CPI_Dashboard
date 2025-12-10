import React, { useState, useMemo, useEffect } from 'react';
import { parseCSV } from './utils/parser';
import { filterData, getKPIMetrics, getYearlyAverages, getCommodityAverages } from './utils/analytics';
import { RAW_CSV_DATA } from './constants';
import { CPIDataPoint, SectorType } from './types';
import { Card } from './components/ui/Card';
import { TrendChart } from './components/charts/TrendChart';
import { YearBarChart } from './components/charts/YearBarChart';
import { CommodityChart } from './components/charts/CommodityChart';
import { TrendingUp, Calendar, Filter, BarChart3, PieChart, Activity } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<CPIDataPoint[]>([]);
  const [sector, setSector] = useState<SectorType>(SectorType.COMBINED);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const parsed = parseCSV(RAW_CSV_DATA);
      setData(parsed);
      setIsLoading(false);
    }, 400);
  }, []);

  const filteredData = useMemo(() => {
    let d = filterData(data, sector);
    if (selectedYear) {
      d = d.filter(item => item.Year === selectedYear);
    }
    return d;
  }, [data, sector, selectedYear]);

  const fullSectorData = useMemo(() => {
    return filterData(data, sector);
  }, [data, sector]);

  const kpis = useMemo(() => {
    return getKPIMetrics(selectedYear ? filteredData : fullSectorData);
  }, [filteredData, fullSectorData, selectedYear]);

  const yearlyData = useMemo(() => {
    return getYearlyAverages(fullSectorData);
  }, [fullSectorData]);

  const commodityData = useMemo(() => {
    return getCommodityAverages(filteredData);
  }, [filteredData]);

  const handleYearClick = (year: number) => {
    setSelectedYear(prev => prev === year ? null : year);
  };

  if (isLoading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#f8fafc] flex flex-col overflow-hidden font-sans text-slate-900">
      {/* Fixed Header */}
      <header className="flex-none h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
             <Activity className="text-white w-5 h-5" />
           </div>
           <div>
             <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">India CPI Analytics</h1>
             <p className="text-xs text-slate-500 font-medium mt-0.5">Inflation Monitoring Dashboard</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           {selectedYear && (
             <button 
               onClick={() => setSelectedYear(null)}
               className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-semibold border border-indigo-100 hover:bg-indigo-100 transition-colors"
             >
               <Filter size={14} />
               Reset Year: {selectedYear}
             </button>
           )}

           <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
               {Object.values(SectorType).map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    sector === s 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {s === SectorType.COMBINED ? "Combined" : s}
                </button>
              ))}
            </div>
        </div>
      </header>

      {/* Main Content Grid - Max Width added to restore correct proportions */}
      <main className="flex-1 p-6 min-h-0 grid grid-cols-12 grid-rows-[auto_1fr] gap-6 max-w-[1600px] w-full mx-auto">
         
         {/* KPI Row (Top) - Increased height to 32 (128px) for better aspect ratio */}
         <div className="col-span-12 grid grid-cols-4 gap-6 h-32 flex-none">
              <Card 
                title="Average CPI" 
                value={kpis.avgCPI} 
                subtext={selectedYear ? "Year Average" : "10-Year Average"} 
                trend="neutral"
              />
              <Card 
                title="Total Inflation" 
                value={kpis.inflation} 
                subtext={selectedYear ? `Jan - Dec ${selectedYear}` : "2013 - 2023"} 
                isPercentage 
                trend={parseFloat(kpis.inflation) > 0 ? "up" : "down"}
              />
              <Card 
                title="Highest Category" 
                value={kpis.highestCatValue} 
                subtext={kpis.highestCatName} 
                highlight
              />
              <Card 
                title="Time Period" 
                value={selectedYear ? selectedYear.toString() : "2013-2023"} 
                subtext={selectedYear ? "Filter Applied" : "Full Range"}
                icon={<Calendar size={18} className="text-slate-400" />}
              />
         </div>

         {/* Charts Area (Bottom) - Fills remaining space */}
         <div className="col-span-12 grid grid-cols-12 gap-6 min-h-0">
            
            {/* Left: Trend Chart (Larger) */}
            <div className="col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
               <div className="flex justify-between items-center mb-2 flex-none">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                   <TrendingUp size={16} className="text-indigo-500"/>
                   Consumer Price Index Trend
                 </h3>
               </div>
               <div className="flex-1 min-h-0">
                 <TrendChart data={filteredData} />
               </div>
            </div>

            {/* Right: Year & Commodity (Stacked) */}
            <div className="col-span-4 grid grid-rows-2 gap-6 min-h-0">
               
               {/* Year Bar Chart */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col min-h-0">
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide flex-none">
                    <BarChart3 size={16} className="text-indigo-500"/>
                    Year-over Year CPI
                  </h3>
                  <div className="flex-1 min-h-0">
                    <YearBarChart 
                      data={yearlyData} 
                      onBarClick={handleYearClick} 
                      selectedYear={selectedYear}
                    />
                  </div>
               </div>

               {/* Commodity Chart */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col min-h-0">
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide flex-none">
                    <PieChart size={16} className="text-indigo-500"/>
                    Commodity-wise CPI
                  </h3>
                  <div className="flex-1 min-h-0">
                    <CommodityChart data={commodityData} />
                  </div>
               </div>
            </div>

         </div>
      </main>
    </div>
  );
}