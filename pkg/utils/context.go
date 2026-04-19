package utils

import "github.com/gin-gonic/gin"

func GetUserID(ctx *gin.Context) (string, MessageJSON) {
	rawID, exists := ctx.Get("userID")
	if !exists {
		return "", MessageJSON{Code: 500, Message: "user id not found in context"}
	}

	idString, ok := rawID.(string)
	if !ok {
		return "", MessageJSON{Code: 500, Message: "invalid user id type"}
	}

	return idString, MessageJSON{}
}
