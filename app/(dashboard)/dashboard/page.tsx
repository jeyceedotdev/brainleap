import { createCourse } from '@/lib/actions/course'
import { getUser } from '@/lib/queries/user'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader } from '@/ui/card'
import { FormButton } from '@/ui/form'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { unstable_noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import { Course } from './components/course'
import { TextField } from '@/ui/rac/text-field'

export default async function Page() {
  unstable_noStore()

  const supabase = createClient()

  const user = await getUser()

  async function getCoursesById(courseIds: Array<string | null>) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .in('id', courseIds)

    if (error) {
      throw error
    }
    return data
  }

  async function getEnrollments(userId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    return data
  }
  async function getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .limit(1)
      .single()

    if (error) {
      throw error
    }

    return data
  }
  const enrollmentsData = await getEnrollments(user.id)
  const profileData = await getProfile(user.id)

  const [enrollments, profile] = await Promise.all([
    enrollmentsData,
    profileData,
  ])

  const courseIds = enrollments.map(enrollment => enrollment.course_id)
  const courses = await getCoursesById(courseIds)

  if (!courses) {
    return notFound()
  }

  return (
    <section className="col-start-1 row-start-2">
      <div className="grid grid-cols-4 gap-4 p-4">
        {courses.map(course => (
          <Course key={course.id} course={course} />
        ))}
        <Card>
          <CardHeader>Create a new course</CardHeader>
          <CardContent>
            {profile.role === 'instructor' && (
              <form className="flex flex-col gap-2" action={createCourse}>
                <TextField type="text" name="name" label="Name" />
                <TextField type="text" name="description" label="Description" />
                <TextField type="text" name="category" label="Category" />
                <FormButton>Create Course</FormButton>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
