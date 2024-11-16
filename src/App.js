// Import essential libraries and styles
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { 
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  ThermometerSun, Info, FlaskConical, Filter, ChevronRight, ChevronLeft, AlertTriangle, Droplet, Home, BarChart2, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'tailwindcss/tailwind.css';

// Sample data for visualizations
const sampleData = [
  {
    date: '2023-01-01',
    temperature: 18,
    prevDayTemp: 17.5,
    nitrat: 10,
    nitrit: 5,
    phosphat: 8,
    ph: 7,
    sauerstoff: 15,
    carbonhearte: 3,
    ammonium: 2,
    notes: "Clear conditions with no significant debris."
  },
  {
    date: '2023-01-02',
    temperature: 19,
    prevDayTemp: 18,
    nitrat: 12,
    nitrit: 6,
    phosphat: 9,
    ph: 7.1,
    sauerstoff: 14.5,
    carbonhearte: 3.2,
    ammonium: 2.1,
    notes: "Slight increase in turbidity, minor debris observed."
  }
  // More sample data points
];

// Parameter Information
const parameterInfo = {
  nitrat: { label: 'Nitrate', unit: 'mg/L', alert: 50, warning: 30, icon: FlaskConical, color: 'text-red-600' },
  nitrit: { label: 'Nitrite', unit: 'mg/L', alert: 1, warning: 0.5, icon: FlaskConical, color: 'text-yellow-600' },
  phosphat: { label: 'Phosphate', unit: 'mg/L', alert: 2, warning: 1, icon: FlaskConical, color: 'text-blue-600' },
  ph: { label: 'pH Value', unit: '', alert: 8.5, warning: 8, icon: Droplet, color: 'text-green-600' },
  sauerstoff: { label: 'Oxygen Content', unit: 'mg/L', alert: 6, warning: 7, icon: Droplet, color: 'text-teal-600' },
  carbonhearte: { label: 'Carbonate Hardness', unit: '°dH', alert: 15, warning: 12, icon: FlaskConical, color: 'text-purple-600' },
  ammonium: { label: 'Ammonium', unit: 'mg/L', alert: 1, warning: 0.5, icon: FlaskConical, color: 'text-orange-600' }
};

// Overview Component
const Overview = ({ loading }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#001233]">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <Skeleton height={200} count={2} />
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-md rounded p-4"
            >
              <h2 className="text-xl font-semibold mb-4 text-[#001233]">Measurement Location</h2>
              <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
                <span className="text-gray-500">Map Placeholder</span>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white shadow-md rounded p-4"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center text-[#001233]">
                <Info className="w-5 h-5 mr-2 text-blue-500" data-tip="Project Overview Information" />
                Project Overview
              </h2>
              <ReactTooltip />
              <div className="prose">
                <p className="text-gray-600 mb-4">
                  The Ems Jade Kanal Water Quality Monitoring Project tracks vital water quality parameters
                  throughout the year. This initiative helps understand the canal's ecological health and
                  identifies potential environmental concerns.
                </p>
                <div className="bg-blue-50 p-4 rounded">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Key Objectives:</h3>
                  <ul className="list-disc list-inside text-sm text-blue-700">
                    <li>Monitor water quality parameters</li>
                    <li>Track seasonal changes</li>
                    <li>Identify environmental impacts</li>
                    <li>Support ecological preservation</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {Object.entries(parameterInfo).map(([key, info], index) => (
          <motion.div 
            key={key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-2">
              {React.createElement(info.icon, { className: `${info.color} w-5 h-5 mr-2`, 'data-tip': info.label })}
              <h3 className="font-medium text-[#001233]">{info.label}</h3>
              <ReactTooltip />
              </div>
            <p className={`text-2xl font-bold ${info.color}`}>
              {sampleData[0][key]} {info.unit}
            </p>
            <p className="text-sm text-gray-500">Latest Reading</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Graphs Component
const Graphs = () => {
  const [selectedParameters, setSelectedParameters] = useState(['nitrat', 'phosphat', 'ph']);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#001233]">Graphs</h1>

      {/* Parameter Selection */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-medium mb-3 flex items-center text-[#001233]">
          <Filter className="w-4 h-4 mr-2" />
          Select Parameters to Display
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(parameterInfo).map(([key, info]) => (
            <button
              key={key}
              onClick={() => {
                if (selectedParameters.includes(key)) {
                  setSelectedParameters(selectedParameters.filter(p => p !== key));
                } else {
                  setSelectedParameters([...selectedParameters, key]);
                }
              }}
              className={`px-3 py-1 rounded-full text-sm transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                selectedParameters.includes(key)
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {info.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-[#001233]">Parameter Development</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedParameters.map((param, index) => (
                <Line
                  key={param}
                  type="monotone"
                  dataKey={param}
                  name={parameterInfo[param].label}
                  stroke={`hsl(${index * 40}, 70%, 50%)`}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Individual Readings Component
const IndividualReadings = ({ loading }) => {
  const [currentReading, setCurrentReading] = useState(0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#001233]">Individual Readings</h1>

      {loading ? (
        <Skeleton height={400} />
      ) : (
        <>
          {/* Reading Navigation */}
          <div className="flex justify-between items-center bg-white rounded-lg shadow p-4">
            <button 
              onClick={() => setCurrentReading(prev => Math.max(0, prev - 1))}
              className="p-2 rounded hover:bg-gray-100 transition-transform transform hover:scale-105"
              disabled={currentReading === 0}
            >
              <ChevronLeft className={currentReading === 0 ? "text-gray-300" : "text-gray-600"} />
            </button>
            <div className="text-center">
              <h3 className="font-medium text-[#001233]">Reading {currentReading + 1} of {sampleData.length}</h3>
              <p className="text-sm text-gray-500">{sampleData[currentReading].date}</p>
            </div>
            <button 
              onClick={() => setCurrentReading(prev => Math.min(sampleData.length - 1, prev + 1))}
              className="p-2 rounded hover:bg-gray-100 transition-transform transform hover:scale-105"
              disabled={currentReading === sampleData.length - 1}
            >
              <ChevronRight className={currentReading === sampleData.length - 1 ? "text-gray-300" : "text-gray-600"} />
            </button>
          </div>

          {/* Reading Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow p-6 mt-6"
          >
            {/* Temperature Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#001233]">Temperature Records</h3>
                <ThermometerSun className="text-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="bg-orange-50 p-3 rounded">
                  <p className="text-sm text-orange-700">Current Day</p>
                  <p className="text-xl font-bold text-orange-600">
                    {sampleData[currentReading].temperature}°C
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-700">Previous Day</p>
                  <p className="text-xl font-bold text-blue-600">
                    {sampleData[currentReading].prevDayTemp}°C
                  </p>
                </div>
              </div>
            </div>

            {/* Measurements Grid */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-[#001233]">Chemical Parameters</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(sampleData[currentReading]).filter(([key]) => parameterInfo[key]).map(([key, value]) => (
                  <motion.div 
                    key={key} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border rounded p-3 flex items-center hover:shadow-lg transition-shadow duration-300"
                  >
                    {React.createElement(parameterInfo[key].icon, { className: `${parameterInfo[key].color} w-5 h-5 mr-2`, 'data-tip': parameterInfo[key].label })}
                    <ReactTooltip />
                    <div>
                      <p className="text-sm text-gray-500">{parameterInfo[key].label}</p>
                      <p className={`font-medium ${parameterInfo[key].color}`}>
                        {value} {parameterInfo[key].unit}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>


            {/* Notes Section */}
            <div>
              <h3 className="text-lg font-medium mb-2 text-[#001233]">Notes & Observations</h3>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 p-4 rounded"
              >
                <p className="text-gray-700">{sampleData[currentReading].notes}</p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

// Main App Component with Updated Sidebar and Interactivity
const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-[#ebebeb] text-[#fbfbff]">
      {/* Sidebar Navigation */}
      <motion.div
        className="flex flex-col bg-[#001233] p-4 rounded-r-3xl w-80 shadow-lg hover:shadow-2xl transition-shadow duration-500"
        initial={{ width: 0 }}
        animate={{ width: "20rem" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col space-y-4">
          <Link to="/" className={`relative flex items-center justify-center bg-[#003366] p-8 rounded-lg hover:bg-[#004080] transition-colors ripple-effect ${location.pathname === '/' ? 'ring-4 ring-[#004080]' : ''}`}>
            <Home className="w-20 h-20 text-[#004080] absolute opacity-20" />
            <span className="relative text-2xl font-bold text-[#fbfbff]">Overview</span>
          </Link>
          <Link to="/graphs" className={`relative flex items-center justify-center bg-[#003366] p-8 rounded-lg hover:bg-[#004080] transition-colors ripple-effect ${location.pathname === '/graphs' ? 'ring-4 ring-[#004080]' : ''}`}>
            <BarChart2 className="w-20 h-20 text-[#004080] absolute opacity-20" />
            <span className="relative text-2xl font-bold text-[#fbfbff]">Graphs</span>
          </Link>
          <Link to="/readings" className={`relative flex items-center justify-center bg-[#003366] p-8 rounded-lg hover:bg-[#004080] transition-colors ripple-effect ${location.pathname === '/readings' ? 'ring-4 ring-[#004080]' : ''}`}>
            <Search className="w-20 h-20 text-[#004080] absolute opacity-20" />
            <span className="relative text-2xl font-bold text-[#fbfbff]">Readings</span>
          </Link>
        </div>
      </motion.div>

      {/* Page Content with Smooth Transition */}
      <div className="flex-grow p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route exact path="/" element={<Overview loading={false} />} />
              <Route path="/graphs" element={<Graphs />} />
              <Route path="/readings" element={<IndividualReadings loading={false} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Starting Animation Function
const StartAnimation = () => {
  return (
    <Router>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <App />
      </motion.div>
    </Router>
  );
};

// Export the App
export default StartAnimation;