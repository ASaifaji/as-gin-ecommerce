package middlewares

import()

func Pointer[T any](d T) *T {
    return &d
}