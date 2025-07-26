import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const Tablet = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Tabs defaultValue="0" className="w-full">
      <TabsList className="flex w-full bg-white p-1 rounded-lg shadow-sm space-x-1">
        {tabs.map((tab, index) => (
          <TabsTrigger
            key={tab.name}
            value={index.toString()}
            className="flex-1 text-base py-5 data-[state=active]:bg-usiu-yellow data-[state=active]:text-usiu-blue data-[state=active]:shadow-md transition-all duration-200"
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, index) => (
        <TabsContent key={index} value={index.toString()} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Tablet;
