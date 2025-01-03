"use client"
import { useEffect, useState } from 'react';
import useFetch from '@/ApiHandle/useFetch';
import { useParams } from 'next/navigation';

const ProfileCard = () => {
    const id = useParams().id;
    const { data: profileInfo, loading } = useFetch(`/user/${id}`);
    const [activeTab, setActiveTab] = useState('public');
    const { data: pdfDetails } = useFetch(`/pdf/user/${id}`);
    const publicPdfs = pdfDetails?.filter(pdf => pdf.is_public) || [];
    const privatePdfs = pdfDetails?.filter(pdf => !pdf.is_public) || [];

    return (
      <div>
         <div className="grid gap-4 p-4 lg:grid-cols-3 mx-5 md:mx-40 my-10">
            <div className="flex flex-col items-center justify-center text-center bg-gray-100 pt-2 rounded-lg">
                <div className="rounded-full">
                    {profileInfo?.img_url ? (
                        <img
                            src={process.env.NEXT_PUBLIC_ENDPOINT + '/' + profileInfo.img_url}
                            alt="Profile"
                            className="rounded-full h-24 md:h-60 md:w-60 w-24"
                        />
                    ) : (
                        <div className="rounded-full h-24 md:h-32 md:w-32 w-24 flex items-center justify-center bg-[#7BA1A4] text-white text-3xl font-bold">
                            {profileInfo?.name?.[0]}
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <h2 className="text-xl font-semibold">{profileInfo?.name}</h2>
                    {/* <p className="text-gray-500">{profileInfo?.role}</p> */}
                    <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-sm text-gray-600">{privatePdfs?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-600">{publicPdfs?.length || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 lg:p-4 px-2 py-4 rounded-lg lg:col-span-2">
                <div className="grid grid-cols-1 gap-4 px-4 lg:px-8 py-2">
                    <div className='flex justify-between'>
                        <div className="contact-item text-lg font-bold">About</div>
                    </div>
                    <div className="contact-item flex justify-between">
                        <div className='text-black'>Name</div>
                        <div className='text-gray-600'>{profileInfo?.name}</div>
                    </div>
                    <hr />
                    <div className="contact-item flex justify-between">
                        <div className='text-black'>Email</div>
                        <div className='text-gray-600'>{profileInfo?.email}</div>
                    </div>
                    <hr />
                    <div className="contact-item flex justify-between">
                        <div className='text-black'>Bio</div>
                        <div className='text-gray-600'>{profileInfo?.bio}</div>
                    </div>
                    <hr />
                    <div className="contact-item flex justify-between">
                        <div className='text-black'>Phone</div>
                        <div className='text-gray-600'>{profileInfo?.phone}</div>
                    </div>
                    <hr />
                    <div className="contact-item flex justify-between">
                        <div className='text-black'>Place</div>
                        <div className='text-gray-600'>{profileInfo?.place}</div>
                    </div>
                    <hr />
                </div>
            </div>
        </div>
      <div className="bg-gray-100 lg:p-4 px-2 py-4 rounded-lg lg:col-span-3 mx-5 md:mx-40 my-10">
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <div className="contact-item text-lg font-bold">Documents</div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('public')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'public' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Public
              </button>
              <button
                onClick={() => setActiveTab('private')} 
                className={`px-4 py-2 rounded-lg ${activeTab === 'private' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Private
              </button>
            </div>
          </div>
          
          {activeTab === 'public' ? (
            publicPdfs.length > 0 ? (
              publicPdfs.map((pdf, index) => (
                <div key={index} className="flex flex-col gap-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{pdf.title}</h3>
                      <p className="text-gray-600">{pdf.caption}</p>
                    </div>
                    <a 
                      href={`${process.env.NEXT_PUBLIC_ENDPOINT}/${pdf.pdf_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View PDF
                    </a>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {pdf?.tags?.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">
                No public documents available
              </div>
            )
          ) : (
            privatePdfs.length > 0 ? (
              privatePdfs.map((pdf, index) => (
                <div key={index} className="flex flex-col gap-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{pdf.title}</h3>
                      <p className="text-gray-600">{pdf.caption}</p>
                    </div>
                    <a 
                      href={`${process.env.NEXT_PUBLIC_ENDPOINT}/${pdf.pdf_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View PDF
                    </a>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {pdf.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">
                No private documents available
              </div>
            )
          )}
        </div>
      </div>
      </div> 
    );
};

export default ProfileCard;
