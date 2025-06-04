
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, folderId, accessToken } = await req.json()

    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: 'Access token is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (action === 'getFolderPath') {
      // Get folder path from Google Drive API
      const folderPath = await getFolderPath(folderId, accessToken)
      
      return new Response(
        JSON.stringify({ path: folderPath }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (action === 'listFolders') {
      // List folders in Google Drive
      const folders = await listFolders(folderId, accessToken)
      
      return new Response(
        JSON.stringify({ folders }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function getFolderPath(folderId: string, accessToken: string): Promise<string> {
  if (!folderId || folderId === 'root') {
    return 'Drive'
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${folderId}?fields=name,parents`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch folder information')
  }

  const folder = await response.json()
  
  if (!folder.parents || folder.parents.length === 0) {
    return folder.name
  }

  const parentPath = await getFolderPath(folder.parents[0], accessToken)
  return `${parentPath} > ${folder.name}`
}

async function listFolders(parentId: string = 'root', accessToken: string) {
  const query = `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
  
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,parents)`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to list folders')
  }

  const data = await response.json()
  return data.files || []
}
