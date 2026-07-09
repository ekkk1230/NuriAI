import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ContentBox } from "./ContentBox";
import { Plan } from "@/type/Plan";

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-sm rounded-lg">
                <p className="text-[1.4rem] mb-[.8rem] font-bold text-gray-700">{label}</p>
                <p className="text-[1.2rem] text-indigo-500 font-semibold">좋아요: {payload[0].value}</p>
                <p className="text-[1.2rem] text-emerald-500 font-semibold">저장: {payload[1].value}</p>
            </div>
        );
    }

    return null;
}

const relationChartData = [
    { date: '07.01', likes: 5, saves: 2 },
    { date: '07.02', likes: 8, saves: 4 },
    { date: '07.03', likes: 3, saves: 1 },
    { date: '07.04', likes: 12, saves: 7 },
    { date: '07.05', likes: 15, saves: 5 },
    { date: '07.06', likes: 10, saves: 8 },
    { date: '07.07', likes: 20, saves: 12 },
];

function RelationChart({ recentStatistics }: { recentStatistics: any }) {    
    
    console.log(recentStatistics);

    return (
        <ContentBox title="사용자 반응 추이" subTitle="최근 7일간의 좋아요 및 저장 수치 추이">
            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={recentStatistics} margin={{ top: 5, right: 10, left: -10, bottom: 20 }}>
                    <defs>
                        <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSaves" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#9ca3af' }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#9ca3af' }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                
                    <Line 
                        type="monotone" 
                        dataKey="likes" 
                        name="좋아요"
                        stroke="#6366f1" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                        activeDot={{ r: 6, strokeWidth: 0 }} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="saves" 
                        name="저장"
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                        activeDot={{ r: 6, strokeWidth: 0 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </ContentBox>
    )
}

export default RelationChart