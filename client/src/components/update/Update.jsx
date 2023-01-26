import { useState } from 'react'
import { makeRequest } from '../../axios'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import './update.scss'

const Update = ({ setOpenUpdate, user }) => {
    const [text, setText] = useState({
        name: '',
        city: '',
        webcite: '',
    })
    const [cover, setCover] = useState(null)
    const [profile, setProfile] = useState(null)

    const upload = async (file) => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await makeRequest.post('/upload', formData)
            return res.data
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        setText((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const queryClient = useQueryClient()
    const mutation = useMutation(
        (user) => {
            return makeRequest.put('/users', user)
        },
        {
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries({ queryKey: ['user'] })
            },
        }
    )
    console.log(user)
    const handleClick = async (e) => {
        e.preventDefault()
        let coverUrl
        let profileUrl
        coverUrl = cover ? await upload(cover) : user.coverPic
        profileUrl = profile ? await upload(profile) : user.profilePic

        mutation.mutate({ ...text, coverPic: coverUrl, profilePic: profileUrl })
        setOpenUpdate(false)
    }
    return (
        <div className='update'>
            <form>
                <input type='file' onChange={(e)=> setCover(e.target.files[0])}/>
                <input type='file' onChange={(e)=> setProfile(e.target.files[0])} />
                <input type='text' name='name' onChange={handleChange} />
                <input type='text' name='city' onChange={handleChange} />
                <input type='text' name='website' onChange={handleChange} />
                <button onClick={handleClick}>Update</button>
            </form>
            <button onClick={() => setOpenUpdate(false)}>X</button>
        </div>
    )
}

export default Update
