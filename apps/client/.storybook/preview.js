import 'tailwindcss/tailwind.css'
import { addDecorator } from '@storybook/react'
import { withTests } from '@storybook/addon-jest'
import results from '../.jest-test-results.json'

addDecorator(withTests({ results }))
