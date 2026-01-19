using FluentValidation;
using MediatR;

namespace ChatApp.Core.Application.Behaviours
{
    public class ValidationBehaviour<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
        : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    {
        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            if (!validators.Any())
                return await next();

            var context = new ValidationContext<TRequest>(request);

            var failures = await Task.WhenAll(
                validators.Select(v => v.ValidateAsync(context, cancellationToken)));

            var errors = failures
                .SelectMany(r => r.Errors)
                .Where(f => f != null)
                .ToList();

            if (errors.Any())
                throw new ValidationException(errors);

            return await next();
        }
    }
}
