"use client";
import { useState, useEffect } from "react";
import useFetch from "@/ApiHandle/useFetch";
import handleDownloadPDF from "@/components/pdf/handleDownloadPDF";
import { Button } from "@/components/ui/components/button";

export default function UserList() {
  const { data, loading, error } = useFetch("/user/all");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading users</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="grid gap-4">
        {data?.map((user) => (
          <div key={user.id} className="border p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold">Name:</p>
                <p>{user.name}</p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="font-semibold">Phone:</p>
                <p>{user.phone}</p>
              </div>
              <div>
                <p className="font-semibold">Place:</p>
                <p>{user.place}</p>
              </div>
              <div>
                <p className="font-semibold">Role:</p>
                <p>{user.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p>lorem50</p>
      <Button
        onClick={handleDownloadPDF}
      >
        Download PDF
      </Button>
    </div>
  );
}
