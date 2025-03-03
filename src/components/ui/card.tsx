import * as React from "react";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>{children}</div>;
};

export const CardHeader = ({ children }: { children: React.ReactNode }) => {
    return <div className="pb-2 border-b">{children}</div>;
};

export const CardTitle = ({ children }: { children: React.ReactNode }) => {
    return <h2 className="text-lg font-semibold">{children}</h2>;
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {
    return <div className="mt-2">{children}</div>;
};
