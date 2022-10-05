/** @jsxImportSource solid-js */
import type { ParentProps, Setter } from 'solid-js'
import type { DictionaryKeys, PasswordContextType } from '@components/marsidev/types'
import { createContext, useContext, createSignal, createMemo } from 'solid-js'
import { generatePassword } from '@components/marsidev/utils/generate-password'
import { DEFAULT_OPTIONS, DEFAULT_PASSWORD_LENGTH } from '@components/marsidev/utils/constants'

const PasswordContext = createContext<PasswordContextType>()

export const PasswordProvider = (props: ParentProps) => {
	const [passwordLength, setPasswordLength] = createSignal(DEFAULT_PASSWORD_LENGTH)
	const [withUpper, setWithUpper] = createSignal(true)
	const [withLower, setWithLower] = createSignal(true)
	const [withNumbers, setWithNumbers] = createSignal(true)
	const [withSymbols, setWithSymbols] = createSignal(true)
	const [passwordDictionary, setPasswordDictionary] = createSignal(DEFAULT_OPTIONS)
	const initialPassword = createMemo(() => generatePassword(passwordLength(), passwordDictionary()))
	const [password, setPassword] = createSignal(initialPassword())

	const store: PasswordContextType = {
		password,
		length: passwordLength,
		uppercase: withUpper,
		lowercase: withLower,
		numbers: withNumbers,
		symbols: withSymbols,
		dictionary: passwordDictionary,

		generate: () => updatePassword(),
		onChangeLength: (length) => onChangeLength(length),
		onToggleUppercase: (event) => onToggleCheckbox(event, setWithUpper),
		onToggleLowercase: (event) => onToggleCheckbox(event, setWithLower),
		onToggleNumbers: (event) => onToggleCheckbox(event, setWithNumbers),
		onToggleSymbols: (event) => onToggleCheckbox(event, setWithSymbols)
	}

	function updatePassword() {
		const newPassword = generatePassword(passwordLength(), passwordDictionary())
		setPassword(newPassword)
	}

	function updateDictionary() {
		let dict: DictionaryKeys = []

		if (withUpper()) {
			dict = [...dict, 'uppercase']
		}

		if (withLower()) {
			dict = [...dict, 'lowercase']
		}

		if (withNumbers()) {
			dict = [...dict, 'numbers']
		}

		if (withSymbols()) {
			dict = [...dict, 'symbols']
		}

		setPasswordDictionary(dict)
	}

	function onChangeLength(length: string | number) {
		const _length = typeof length === 'string' ? parseInt(length) : length
		setPasswordLength(_length)
		updatePassword()
	}

	function onToggleCheckbox(event: InputEvent, setter: Setter<boolean>) {
		event.preventDefault()

		setter((prev) => {
			const next = !prev

			if (next === true) return next
			if (passwordDictionary().length > 1) return next // unchecking a checkbox when there is 2+ checkboxes checked

			console.log('cannot uncheck! at least 1 checkbox should be checked')
			return prev
		})

		updateDictionary()
		updatePassword()
	}

	return <PasswordContext.Provider value={store}>{props.children}</PasswordContext.Provider>
}

export const usePassword = (): PasswordContextType => useContext(PasswordContext)
