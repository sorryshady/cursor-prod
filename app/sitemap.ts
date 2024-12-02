
import {  MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        },
        {
            url:`${process.env.NEXT_PUBLIC_BASE_URL}/about`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/committee`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/committee/state-committee`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/downloads`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/news`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/gallery`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletter`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/updates`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/forgot-password`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/register`
        },
    ]
}
